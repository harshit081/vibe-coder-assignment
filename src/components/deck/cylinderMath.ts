export const PERSPECTIVE_D = 1350;

export interface CylinderMetrics {
  cardW: number;
  cardH: number;
}

export interface CylinderTransform {
  hidden: boolean;
  x: number;
  z: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  zIndex: number;
  opacity: number;
  centerFactor: number;
}

export function wrapOffset(offset: number, count: number): number {
  const half = count / 2;
  let wrapped = offset;
  while (wrapped > half) wrapped -= count;
  while (wrapped < -half) wrapped += count;
  return wrapped;
}

export function computeOrbitRadius(
  metrics: CylinderMetrics,
  viewportW: number
): number {
  const base = metrics.cardW * 1.28 + 150;
  const maxFactor = viewportW < 1024 ? 0.4 : 0.34;
  const minRadius = viewportW < 1024 ? 160 : 220;
  return Math.min(Math.max(base, minRadius), viewportW * maxFactor);
}

export function computeOrbitStageSize(
  metrics: CylinderMetrics,
  orbitRadius: number
): { width: number; height: number } {
  return {
    width: Math.ceil(orbitRadius * 2 + metrics.cardW + 48),
    height: Math.ceil(metrics.cardH + 64),
  };
}

/** Planet-style ring orbit: cards revolve around a fixed centre on the X/Z plane. */
export function computeOrbitalTransform(
  offset: number,
  count: number,
  orbitRadius: number,
  mouse: { x: number; y: number }
): CylinderTransform {
  const angleDeg = offset * (360 / count);
  const rad = (angleDeg * Math.PI) / 180;

  const x = Math.sin(rad) * orbitRadius;
  const z = Math.cos(rad) * orbitRadius - orbitRadius;

  const absOffset = Math.abs(offset);
  const centerFactor = Math.max(0, 1 - absOffset);

  const maxTiltY = 14;
  const maxTiltX = 10;
  const tiltX = -mouse.y * maxTiltX * centerFactor;
  const tiltY = mouse.x * maxTiltY * centerFactor;

  // Facing: 1 at front, -1 at back — drives orbit fade
  const facing = Math.cos((offset / count) * Math.PI * 2);
  const backOpacity = 0.14;
  const frontOpacity = 1;
  const opacity =
    backOpacity + ((facing + 1) / 2) * (frontOpacity - backOpacity);

  return {
    hidden: false,
    x,
    z,
    rotateX: tiltX,
    rotateY: -angleDeg + tiltY,
    rotateZ: -3,
    zIndex: Math.round(z + orbitRadius),
    opacity: Math.max(backOpacity, Math.min(frontOpacity, opacity)),
    centerFactor,
  };
}
