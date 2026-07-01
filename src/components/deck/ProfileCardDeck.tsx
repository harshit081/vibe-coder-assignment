import { useCallback, useEffect, useRef, useState } from "react";
import type { Platform, UserProfileSummary } from "@/types";
import { CylinderProfileCard } from "./CylinderProfileCard";
import {
  computeOrbitalTransform,
  computeOrbitRadius,
  type CylinderMetrics,
  wrapOffset,
} from "./cylinderMath";

const AUTO_SPEED = 0.0014;
const DRAG_TO_PROGRESS = 0.0042;
const SCROLL_TO_PROGRESS = 0.0009;
const PROGRESS_LERP = 0.12;
const COAST_FRICTION = 0.94;
const COAST_MIN = 0.0008;
const MAX_WHEEL_DELTA = 64;

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
  });
  const pointerVelocity = useRef(0);
  const lastPointer = useRef({ x: 0, t: 0 });
  const sceneRef = useRef<HTMLDivElement>(null);
  const expandedKeyRef = useRef<string | null>(null);

  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<CylinderMetrics>(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const heightFactor = Math.min(1, Math.max(0.62, h / 820));
    let cardW = Math.round(w * 0.14 + 118);
    cardW = Math.round(cardW * heightFactor);
    cardW = Math.min(280, Math.max(168, cardW));
    return { cardW, cardH: Math.round(cardW * 1.72) };
  });

  useEffect(() => {
    expandedKeyRef.current = expandedKey;
  }, [expandedKey]);

  const updateMetrics = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const heightFactor = Math.min(1, Math.max(0.62, h / 820));

    let cardW = Math.round(w * 0.14 + 118);
    cardW = Math.round(cardW * heightFactor);
    cardW = Math.min(280, Math.max(168, cardW));
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

  const renderLoop = useCallback(() => {
    if (count === 0) return;

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

    for (let i = 0; i < count; i++) {
      const card = cardsRefs.current[i];
      if (!card) continue;

      const profile = profiles[i];
      const isExpanded = expanded === profile.user_id;

      if (isExpanded) {
        card.style.visibility = "visible";
        card.style.zIndex = "500";
        card.style.opacity = "1";
        card.style.pointerEvents = "auto";
        card.style.transform =
          "translateX(0px) translateZ(460px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1.08)";
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
      card.style.visibility = "visible";
      card.style.zIndex = String(transform.zIndex);
      card.style.opacity = dimmed ? "0.2" : String(transform.opacity);
      card.style.pointerEvents =
        !dimmed && transform.centerFactor > 0.35 ? "auto" : "none";
      card.style.transform = `translateX(${transform.x.toFixed(2)}px) translateZ(${transform.z.toFixed(2)}px) rotateX(${transform.rotateX.toFixed(2)}deg) rotateY(${transform.rotateY.toFixed(2)}deg) rotateZ(${transform.rotateZ}deg)`;
    }
  }, [count, metrics, profiles]);

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
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startProgress: progress.current,
      moved: false,
    };
    coastVelocity.current = 0;
    lastPointer.current = { x: e.clientX, t: performance.now() };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 6) dragRef.current.moved = true;
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
    coastVelocity.current = -pointerVelocity.current * DRAG_TO_PROGRESS * 0.85;
    dragRef.current.active = false;
    pointerVelocity.current = 0;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleCardSelect = (userId: string) => {
    if (dragRef.current.moved) return;
    setExpandedKey((current) => (current === userId ? null : userId));
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

  return (
    <div className="relative flex h-full min-h-[68vh] flex-col lg:min-h-screen">
      {expandedKey && (
        <button
          type="button"
          aria-label="Close expanded card"
          className="absolute inset-0 z-40 bg-black/55 animate-fade-in"
          onClick={() => setExpandedKey(null)}
        />
      )}

      <div
        ref={sceneRef}
        className="cylinder-scene relative flex flex-1 items-center justify-center overflow-hidden select-none touch-pan-y"
        style={{ perspective: "1350px" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            width: metrics.cardW,
            height: metrics.cardH,
            transformStyle: "preserve-3d",
          }}
        >
          {profiles.map((profile, i) => (
            <div
              key={profile.user_id}
              ref={(el) => {
                cardsRefs.current[i] = el;
              }}
              className="cylinder-card-slot absolute inset-0 cursor-grab active:cursor-grabbing"
              style={{
                width: metrics.cardW,
                height: metrics.cardH,
                transformStyle: "preserve-3d",
                backfaceVisibility: "visible",
                willChange: "transform, opacity",
              }}
            >
              <CylinderProfileCard
                profile={profile}
                platform={platform}
                cardW={metrics.cardW}
                cardH={metrics.cardH}
                expanded={expandedKey === profile.user_id}
                onSelect={() => handleCardSelect(profile.user_id)}
                onClose={() => setExpandedKey(null)}
              />
            </div>
          ))}
        </div>
      </div>

      <p className="pointer-events-none pb-4 text-center text-[11px] uppercase tracking-[0.2em] text-white/30">
        Drag or scroll to orbit · tap front card to expand
      </p>
    </div>
  );
}
