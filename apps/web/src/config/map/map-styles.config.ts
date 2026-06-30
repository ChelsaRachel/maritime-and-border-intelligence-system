export const MAP_STYLE = 'mapbox://styles/mapbox/satellite-streets-v12'
export const MAP_PROJECTION = 'globe' as const

export const MAP_DEFAULTS = {
  center: [117.3, -2.1] as [number, number],
  zoom: 3.45,
  minZoom: 1.6,
  maxZoom: 16,
}
