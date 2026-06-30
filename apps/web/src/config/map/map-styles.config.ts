// Basemap for the National Maritime Picture.
// Mapbox Satellite Streets v12 — citra natural & readable. Neon operational route layer
// (ALKI, jalur resmi, risk corridor, aircraft/vessel route) dibuat tetap menonjol di atas
// citra terang lewat dark casing + neon core di layer-paint.config.ts (bukan dengan menggelapkan basemap).
// Dark Ocean tetap tersedia bila ingin ditukar — cukup ubah `MAP_STYLE` ke MAP_STYLE_DARK_OCEAN.
export const MAP_STYLE_SATELLITE = 'mapbox://styles/mapbox/satellite-streets-v12'
export const MAP_STYLE_DARK_OCEAN = 'mapbox://styles/mapbox/dark-v11'

export const MAP_STYLE = MAP_STYLE_SATELLITE
export const MAP_PROJECTION = 'globe' as const

export const MAP_DEFAULTS = {
  center: [117.3, -2.1] as [number, number],
  zoom: 3.45,
  minZoom: 1.6,
  maxZoom: 16,
}
