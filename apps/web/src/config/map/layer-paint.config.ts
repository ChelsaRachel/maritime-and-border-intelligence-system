function token(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

export function tacticalPaint() {
  return {
    cyan: token('--signal-cyan', 'rgb(0, 224, 255)'),
    teal: token('--signal-teal', 'rgb(0, 245, 196)'),
    green: token('--severity-low', 'rgb(61, 218, 135)'),
    yellow: token('--severity-medium', 'rgb(255, 213, 79)'),
    orange: token('--severity-high', 'rgb(255, 142, 43)'),
    red: token('--severity-critical', 'rgb(255, 66, 80)'),
    ink: token('--ocean-950', 'rgb(2, 10, 18)'),
  }
}
