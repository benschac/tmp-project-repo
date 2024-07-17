interface Point {
  x: number
  y: number
  originX: number
  originY: number
  noiseOffsetX: number
  noiseOffsetY: number
}
/**
 * Generates a centripetal Catmull-Rom spline through the given control points.
 *
 * The centripetal Catmull-Rom spline is a type of interpolating spline (a curve that
 * passes through its control points) with some special properties:
 * 1. It eliminates cusps and self-intersections within curve segments.
 * 2. It produces a more circular curve compared to other Catmull-Rom formulations.
 * 3. It maintains C1 continuity, meaning the curve is continuous in both position and velocity.
 *
 * This implementation uses a centripetal parameterization (α = 0.5) which helps to
 * prevent overshoots and cusps that can occur in uniform Catmull-Rom splines.
 *
 * For more information, see:
 * https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline
 *
 * @param {Point[]} points - An array of control points. Each point should have x and y coordinates.
 * @param {number} [tension=0.5] - Controls the "tightness" of the curve.
 *                                 0.5 is the standard value for a centripetal Catmull-Rom spline.
 * @param {boolean} [close=false] - If true, the spline will form a closed loop.
 *
 * @returns {Point[]} An array of points representing the spline curve.
 *
 * @example
 * const controlPoints = [
 *   { x: 0, y: 0 },
 *   { x: 1, y: 1 },
 *   { x: 2, y: -1 },
 *   { x: 3, y: 0 }
 * ];
 * const splinePoints = centripetal_catmull_rom_spline(controlPoints, 0.5, false);
 */
export function centripetal_catmull_rom_spline(
  points: Point[],
  tension: number = 0.5,
  close: boolean = false
): Point[] {
  'worklet'
  const alpha = 0.5 // Centripetal Catmull-Rom
  const result: Point[] = []

  function get_t(t: number, p0: Point, p1: Point): number {
    const a = Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2)
    const b = Math.pow(a, alpha * 0.5)
    return b + t
  }

  function interpolate(
    t: number,
    p0: Point,
    p1: Point,
    p2: Point,
    p3: Point,
    t0: number,
    t1: number,
    t2: number,
    t3: number
  ): Point {
    const t10 = t1 - t0
    const t21 = t2 - t1
    const t32 = t3 - t2
    const t20 = t2 - t0
    const t31 = t3 - t1

    const b1x = ((t1 - t) / t10) * p0.x + ((t - t0) / t10) * p1.x
    const b2x = ((t2 - t) / t21) * p1.x + ((t - t1) / t21) * p2.x
    const b3x = ((t3 - t) / t32) * p2.x + ((t - t2) / t32) * p3.x

    const c1x = ((t2 - t) / t20) * b1x + ((t - t0) / t20) * b2x
    const c2x = ((t3 - t) / t31) * b2x + ((t - t1) / t31) * b3x

    const dx = ((t2 - t) / t21) * c1x + ((t - t1) / t21) * c2x

    const b1y = ((t1 - t) / t10) * p0.y + ((t - t0) / t10) * p1.y
    const b2y = ((t2 - t) / t21) * p1.y + ((t - t1) / t21) * p2.y
    const b3y = ((t3 - t) / t32) * p2.y + ((t - t2) / t32) * p3.y

    const c1y = ((t2 - t) / t20) * b1y + ((t - t0) / t20) * b2y
    const c2y = ((t3 - t) / t31) * b2y + ((t - t1) / t31) * b3y

    const dy = ((t2 - t) / t21) * c1y + ((t - t1) / t21) * c2y

    return {
      x: dx,
      y: dy,
      originX: dx,
      originY: dy,
      noiseOffsetX: p1.noiseOffsetX,
      noiseOffsetY: p1.noiseOffsetY,
    }
  }

  const count = points.length

  if (count < 4) {
    return points // Not enough points to create a spline
  }

  let t0 = 0
  let t1 = get_t(t0, points[0], points[1])
  let t2 = get_t(t1, points[1], points[2])
  let t3 = get_t(t2, points[2], points[3])

  for (let i = 0; i < (close ? count : count - 3); i++) {
    const p0 = points[i % count]
    const p1 = points[(i + 1) % count]
    const p2 = points[(i + 2) % count]
    const p3 = points[(i + 3) % count]

    const steps = Math.floor(Math.hypot(p2.x - p1.x, p2.y - p1.y) * 10)

    for (let j = 0; j <= steps; j++) {
      const t = t1 + (j / steps) * (t2 - t1)
      result.push(interpolate(t, p0, p1, p2, p3, t0, t1, t2, t3))
    }

    t0 = t1
    t1 = t2
    t2 = t3
    t3 = get_t(t2, p3, points[(i + 4) % count])
  }

  if (close) {
    // Ensure the spline is perfectly closed
    result.push({ ...result[0] })
  }

  return result
}
