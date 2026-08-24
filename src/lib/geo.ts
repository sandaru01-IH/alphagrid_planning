/** Lat/lng helpers for parcel sketch geometry (WGS84). */

export type LatLng = { lat: number; lng: number };

const EARTH_R = 6_371_008.8;

function toRad(d: number) {
  return (d * Math.PI) / 180;
}

/** Great-circle distance in metres. */
export function haversineM(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Geodesic polygon area (m²) via spherical excess — ring need not be closed. */
export function polygonAreaM2(ring: LatLng[]): number {
  if (ring.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length;
    sum += toRad(ring[j].lng - ring[i].lng) * (2 + Math.sin(toRad(ring[i].lat)) + Math.sin(toRad(ring[j].lat)));
  }
  return Math.abs((sum * EARTH_R * EARTH_R) / 2);
}

export function edgeLengthsM(ring: LatLng[]): number[] {
  if (ring.length < 2) return [];
  const lengths: number[] = [];
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length;
    lengths.push(haversineM(ring[i], ring[j]));
  }
  return lengths;
}

/**
 * Derive engine inputs from a drawn ring:
 * - area from geodesic polygon
 * - frontage ≈ longest edge (proxy for road-facing boundary)
 * - depth ≈ area / frontage
 */
export function deriveParcelMetrics(ring: LatLng[]): {
  siteAreaM2: number;
  frontageM: number;
  depthM: number;
} {
  const siteAreaM2 = Math.round(polygonAreaM2(ring));
  const edges = edgeLengthsM(ring);
  const frontageM = Math.max(1, Math.round(Math.max(...edges, 1) * 10) / 10);
  const depthM = Math.max(1, Math.round((siteAreaM2 / frontageM) * 10) / 10);
  return { siteAreaM2, frontageM, depthM };
}

/** Panadura Urban Council approx centre — demo map focus. */
export const PANADURA_CENTER: LatLng = { lat: 6.7139, lng: 79.9042 };
export const PANADURA_DEFAULT_ZOOM = 15;
