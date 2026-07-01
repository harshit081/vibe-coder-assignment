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
  return Math.min(Math.max(base, 220), viewportW * 0.34);
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
  // z: 0 at front, -2*radius at back — normalize to [0, 1]
  const depth = Math.max(0, Math.min(1, (z + 2 * orbitRadius) / (2 * orbitRadius)));

  const absOffset = Math.abs(offset);
  const centerFactor = Math.max(0, 1 - absOffset);

  const maxTiltY = 14;
  const maxTiltX = 10;
  const tiltX = -mouse.y * maxTiltX * centerFactor;
  const tiltY = mouse.x * maxTiltY * centerFactor;

  return {
    hidden: false,
    x,
    z,
    rotateX: tiltX,
    rotateY: -angleDeg + tiltY,
    rotateZ: -3,
    zIndex: Math.round(z + orbitRadius),
    opacity: 0.72 + depth * 0.28,
    centerFactor,
  };
}
