import { useCallback, useEffect, useRef, useState } from "react";
import type { Platform, UserProfileSummary } from "@/types";
import { CylinderProfileCard } from "./CylinderProfileCard";
import { ExpandedProfileShowcase } from "./ExpandedProfileShowcase";
import {
  computeOrbitalTransform,
  computeOrbitRadius,
  computeOrbitStageSize,
  type CylinderMetrics,
  type CylinderTransform,
  wrapOffset,
} from "./cylinderMath";

const AUTO_SPEED = 0.0014;
const DRAG_TO_PROGRESS = 0.0042;
const SCROLL_TO_PROGRESS = 0.0009;
const PROGRESS_LERP = 0.12;
const COAST_FRICTION = 0.94;
const COAST_MIN = 0.0008;
const MAX_WHEEL_DELTA = 64;
const DRAG_THRESHOLD = 10;
const EXPAND_LERP = 0.11;
const EXPANDED_Z = 520;
const EXPANDED_SCALE_X = 1;
const EXPANDED_SCALE_Y = 1;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

interface ProfileCardDeckProps {
  profiles: UserProfileSummary[];
  platform: Platform;
}

export function ProfileCardDeck({ profiles, platform }: ProfileCardDeckProps) {
  const count = profiles.length;
  const cardsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameId = useRef(0);
  const progress = useRef(0);
  const targetProgress = useRef(0);
  const coastVelocity = useRef(0);
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const dragRef = useRef({
    active: false,
    startX: 0,
    startProgress: 0,
    moved: false,
    capturing: false,
    cardUserId: null as string | null,
  });
  const pointerVelocity = useRef(0);
  const lastPointer = useRef({ x: 0, t: 0 });
  const sceneRef = useRef<HTMLDivElement>(null);
  const expandedKeyRef = useRef<string | null>(null);
  const expandProgress = useRef(0);
  const expandTarget = useRef(0);
  const expandFrom = useRef<CylinderTransform | null>(null);
  const clearExpandedWhenClosed = useRef(false);

  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [viewportW, setViewportW] = useState(() => window.innerWidth);
  const [metrics, setMetrics] = useState<CylinderMetrics>(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMobile = w < 1024;
    const heightFactor = Math.min(1, Math.max(0.62, h / 820));
    let cardW: number;
    if (isMobile) {
      // Mobile: keep cards readable (bigger), but we’ll keep typography smaller in the card UI.
      cardW = Math.round(Math.min(176, Math.max(132, w * 0.34)));
    } else {
      cardW = Math.round(w * 0.14 + 118);
      cardW = Math.round(cardW * heightFactor);
      cardW = Math.min(280, Math.max(168, cardW));
    }
    return { cardW, cardH: Math.round(cardW * 1.72) };
  });

  const setExpanded = useCallback((userId: string | null) => {
    expandedKeyRef.current = userId;
    setExpandedKey(userId);
  }, []);

  useEffect(() => {
    expandedKeyRef.current = expandedKey;
  }, [expandedKey]);

  useEffect(() => {
    if (!expandedKey) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [expandedKey]);

  const updateMetrics = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    setViewportW(w);
    const isMobile = w < 1024;
    const heightFactor = Math.min(1, Math.max(0.62, h / 820));

    let cardW: number;
    if (isMobile) {
      cardW = Math.round(Math.min(176, Math.max(132, w * 0.34)));
    } else {
      cardW = Math.round(w * 0.14 + 118);
      cardW = Math.round(cardW * heightFactor);
      cardW = Math.min(280, Math.max(168, cardW));
    }
    const cardH = Math.round(cardW * 1.72);

    setMetrics({ cardW, cardH });
  }, []);

  useEffect(() => {
    const onResize = () => updateMetrics();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateMetrics]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const rx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const ry = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      mouse.current.targetX = Math.max(-1, Math.min(1, rx));
      mouse.current.targetY = Math.max(-1, Math.min(1, ry));
    };
    const onMouseLeave = () => {
      mouse.current.targetX = 0;
      mouse.current.targetY = 0;
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  useEffect(() => {
    cardsRefs.current.length = count;
  }, [count]);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el || count === 0) return;

    const onWheel = (e: WheelEvent) => {
      if (expandedKeyRef.current) return;
      e.preventDefault();
      const raw =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const delta =
        Math.sign(raw) * Math.min(Math.abs(raw), MAX_WHEEL_DELTA);
      targetProgress.current += delta * SCROLL_TO_PROGRESS;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [count]);

  const closeExpanded = useCallback(() => {
    expandTarget.current = 0;
    clearExpandedWhenClosed.current = true;
  }, []);

  const renderLoop = useCallback(() => {
    if (count === 0) return;

    expandProgress.current +=
      (expandTarget.current - expandProgress.current) * EXPAND_LERP;

    if (
      clearExpandedWhenClosed.current &&
      expandProgress.current < 0.02
    ) {
      clearExpandedWhenClosed.current = false;
      expandProgress.current = 0;
      expandFrom.current = null;
      expandedKeyRef.current = null;
      queueMicrotask(() => setExpanded(null));
    }

    if (!dragRef.current.active && !expandedKeyRef.current) {
      if (Math.abs(coastVelocity.current) > COAST_MIN) {
        targetProgress.current += coastVelocity.current;
        coastVelocity.current *= COAST_FRICTION;
      } else {
        coastVelocity.current = 0;
        targetProgress.current += AUTO_SPEED;
      }
      progress.current +=
        (targetProgress.current - progress.current) * PROGRESS_LERP;
    }

    mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.08;
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.08;

    const viewportW = window.innerWidth;
    const orbitRadius = computeOrbitRadius(metrics, viewportW);
    const virtualActive = progress.current;
    const expanded = expandedKeyRef.current;
    const expandT = easeOutCubic(expandProgress.current);
    const from = expandFrom.current;

    for (let i = 0; i < count; i++) {
      const card = cardsRefs.current[i];
      if (!card) continue;

      const profile = profiles[i];
      const isExpanded = expanded === profile.user_id;

      if (isExpanded && from) {
        const x = lerp(from.x, 0, expandT);
        const z = lerp(from.z, EXPANDED_Z, expandT);
        const rotX = lerp(from.rotateX, 0, expandT);
        const rotY = lerp(from.rotateY, 0, expandT);
        const rotZ = lerp(from.rotateZ, 0, expandT);
        const scaleX = lerp(1, EXPANDED_SCALE_X, expandT);
        const scaleY = lerp(1, EXPANDED_SCALE_Y, expandT);

        card.style.visibility = "visible";
        card.style.zIndex = "500";
        card.style.opacity = "1";
        card.style.pointerEvents = expandT > 0.5 ? "auto" : "none";
        card.style.transform = `translateX(${x.toFixed(2)}px) translateZ(${z.toFixed(2)}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
        continue;
      }

      const offset = wrapOffset(i - virtualActive, count);
      const transform = computeOrbitalTransform(
        offset,
        count,
        orbitRadius,
        mouse.current
      );

      const dimmed = Boolean(expanded);
      const fade = dimmed ? 1 - expandT * 0.9 : 1;
      card.style.visibility = "visible";
      card.style.zIndex = String(transform.zIndex);
      card.style.opacity = dimmed
        ? String(Math.max(0.05, transform.opacity * fade))
        : String(transform.opacity);
      card.style.pointerEvents =
        !dimmed && Math.abs(offset) < 0.65 ? "auto" : "none";
      card.style.transform = `translateX(${transform.x.toFixed(2)}px) translateZ(${transform.z.toFixed(2)}px) rotateX(${transform.rotateX.toFixed(2)}deg) rotateY(${transform.rotateY.toFixed(2)}deg) rotateZ(${transform.rotateZ}deg)`;
    }
  }, [count, metrics, profiles, setExpanded]);

  useEffect(() => {
    const tick = () => {
      renderLoop();
      frameId.current = requestAnimationFrame(tick);
    };
    frameId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId.current);
  }, [renderLoop]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (expandedKey) return;

    const card = (e.target as HTMLElement).closest("[data-deck-card]");

    dragRef.current = {
      active: true,
      startX: e.clientX,
      startProgress: progress.current,
      moved: false,
      capturing: false,
      cardUserId: card?.getAttribute("data-user-id") ?? null,
    };
    coastVelocity.current = 0;
    lastPointer.current = { x: e.clientX, t: performance.now() };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;

    const dx = e.clientX - dragRef.current.startX;
    if (!dragRef.current.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      dragRef.current.moved = true;
      dragRef.current.capturing = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    if (!dragRef.current.moved) return;

    progress.current = dragRef.current.startProgress - dx * DRAG_TO_PROGRESS;
    targetProgress.current = progress.current;

    const now = performance.now();
    const dt = now - lastPointer.current.t;
    if (dt > 0) {
      pointerVelocity.current = (e.clientX - lastPointer.current.x) / dt;
    }
    lastPointer.current = { x: e.clientX, t: now };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;

    if (dragRef.current.moved) {
      coastVelocity.current = -pointerVelocity.current * DRAG_TO_PROGRESS * 0.85;
    } else if (dragRef.current.cardUserId) {
      handleCardSelect(dragRef.current.cardUserId);
    } else {
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const card = hit?.closest("[data-deck-card]");
      const userId = card?.getAttribute("data-user-id");
      if (userId) {
        handleCardSelect(userId);
      }
    }

    if (dragRef.current.capturing) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    dragRef.current.active = false;
    dragRef.current.capturing = false;
    pointerVelocity.current = 0;
  };

  const handleCardSelect = (userId: string) => {
    if (expandedKey === userId) {
      closeExpanded();
      return;
    }

    const idx = profiles.findIndex((p) => p.user_id === userId);
    if (idx < 0) return;

    const orbitRadius = computeOrbitRadius(metrics, window.innerWidth);
    const offset = wrapOffset(idx - progress.current, count);
    expandFrom.current = computeOrbitalTransform(
      offset,
      count,
      orbitRadius,
      mouse.current
    );

    coastVelocity.current = 0;
    expandProgress.current = 0;
    expandTarget.current = 1;
    clearExpandedWhenClosed.current = false;
    setExpanded(userId);
  };

  if (count === 0) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center px-6 pt-16">
        <div className="glass-panel max-w-sm rounded-3xl px-8 py-10 text-center">
          <p className="font-display text-lg text-white">No creators found</p>
          <p className="mt-2 text-sm text-zinc-400">
            Try another search or switch platform
          </p>
        </div>
      </div>
    );
  }

  const orbitRadius = computeOrbitRadius(metrics, viewportW);
  const stageSize = computeOrbitStageSize(metrics, orbitRadius);
  const expandedProfile = expandedKey
    ? profiles.find((p) => p.user_id === expandedKey)
    : undefined;

  return (
    <div className="relative h-full min-h-0 overflow-hidden">
      {expandedKey && (
        <button
          type="button"
          aria-label="Close expanded card"
          className="fixed inset-0 z-40 bg-black/65 animate-fade-in"
          onClick={closeExpanded}
        />
      )}

      {expandedProfile && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="pointer-events-auto">
            <ExpandedProfileShowcase
              summary={expandedProfile}
              platform={platform}
              onClose={closeExpanded}
            />
          </div>
        </div>
      )}

      <div
        ref={sceneRef}
        className="cylinder-scene relative z-10 flex h-full min-h-0 flex-1 items-center justify-center overflow-hidden select-none touch-pan-y"
        style={{ perspective: "1350px" }}
        onPointerDownCapture={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="absolute left-1/2 top-1/2 pointer-events-none"
          style={{
            width: stageSize.width,
            height: stageSize.height,
            marginLeft: -stageSize.width / 2,
            marginTop: -stageSize.height / 2,
            transformStyle: "preserve-3d",
          }}
        >
          {profiles.map((profile, i) => {
            const isExpanded = expandedKey === profile.user_id;
            return (
              <div
                key={profile.user_id}
                ref={(el) => {
                  cardsRefs.current[i] = el;
                }}
                className={`cylinder-card-slot absolute left-1/2 top-1/2 ${
                  isExpanded ? "" : "cursor-grab active:cursor-grabbing"
                }`}
                style={{
                  width: metrics.cardW,
                  height: metrics.cardH,
                  marginLeft: -metrics.cardW / 2,
                  marginTop: -metrics.cardH / 2,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "visible",
                  willChange: "transform, opacity",
                }}
              >
                {isExpanded ? null : (
                  <CylinderProfileCard
                    profile={profile}
                    platform={platform}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="pointer-events-none absolute inset-x-0 bottom-14 z-20 px-3 text-center text-[10px] uppercase tracking-[0.18em] text-white/30 sm:bottom-2 sm:text-[11px] sm:tracking-[0.2em] lg:bottom-2">
        <span className="lg:hidden">Swipe to browse · tap to open</span>
        <span className="hidden lg:inline">Drag or scroll to orbit · hover for stats · click card to open</span>
      </p>
    </div>
  );
}