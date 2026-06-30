import type { INmpAlert, INmpCurrentEntity, INmpEntitiesFixture, INmpReplayFixture } from '@/features/mbis/types/nmp.types'
import { useCallback, useEffect, useMemo, useState } from 'react'

export type TNmpReplaySpeed = 1 | 2 | 4

export function useNmpReplay(entitiesFixture: INmpEntitiesFixture, replayFixture: INmpReplayFixture, alerts: INmpAlert[]) {
  const lastIndex = replayFixture.replayFrames.length - 1
  const [currentIndex, setCurrentIndex] = useState(lastIndex)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState<TNmpReplaySpeed>(1)

  useEffect(() => {
    if (!isPlaying) return
    const timer = window.setInterval(() => {
      setCurrentIndex((index) => {
        if (index >= lastIndex) {
          setIsPlaying(false)
          return lastIndex
        }
        return index + 1
      })
    }, 700 / speed)
    return () => window.clearInterval(timer)
  }, [isPlaying, lastIndex, speed])

  const playPause = useCallback(() => {
    setIsPlaying((playing) => {
      if (!playing && currentIndex >= lastIndex) setCurrentIndex(0)
      return !playing
    })
  }, [currentIndex, lastIndex])

  const stepBackward = useCallback(() => {
    setIsPlaying(false)
    setCurrentIndex((index) => Math.max(0, index - 1))
  }, [])

  const stepForward = useCallback(() => {
    setIsPlaying(false)
    setCurrentIndex((index) => Math.min(lastIndex, index + 1))
  }, [lastIndex])

  const seek = useCallback((index: number) => {
    setIsPlaying(false)
    setCurrentIndex(Math.min(lastIndex, Math.max(0, Math.round(index))))
  }, [lastIndex])

  const goLive = useCallback(() => {
    setIsPlaying(false)
    setCurrentIndex(lastIndex)
  }, [lastIndex])

  const frame = replayFixture.replayFrames[currentIndex]
  const trackIndex = Math.min(currentIndex + 1, 96)
  const currentEntities = useMemo<INmpCurrentEntity[]>(() => {
    const vesselEntities = entitiesFixture.vessels.map((vessel) => {
      const point = vessel.track[Math.min(trackIndex, vessel.track.length - 1)]
      return {
        id: vessel.id,
        label: vessel.name,
        category: 'VESSEL' as const,
        severity: vessel.severity,
        coordinates: point.coordinates,
        heading: point.heading,
        speed: point.speed,
        trail: vessel.track.slice(Math.max(0, trackIndex - 13), trackIndex + 1).map((trackPoint) => trackPoint.coordinates),
        route: vessel.track.slice(0, trackIndex + 1).filter((_, index) => index % 8 === 0 || index === trackIndex).map((trackPoint) => trackPoint.coordinates),
        detail: vessel,
      }
    })
    const aircraftEntities = entitiesFixture.aircraft.map((aircraft) => {
      const point = aircraft.track[Math.min(trackIndex, aircraft.track.length - 1)]
      return {
        id: aircraft.id,
        label: aircraft.callSign,
        category: 'AIRCRAFT' as const,
        severity: aircraft.severity,
        coordinates: point.coordinates,
        heading: point.heading,
        speed: point.speed,
        trail: aircraft.track.slice(Math.max(0, trackIndex - 13), trackIndex + 1).map((trackPoint) => trackPoint.coordinates),
        route: aircraft.track.slice(0, trackIndex + 1).filter((_, index) => index % 8 === 0 || index === trackIndex).map((trackPoint) => trackPoint.coordinates),
        detail: aircraft,
      }
    })
    return [...vesselEntities, ...aircraftEntities]
  }, [entitiesFixture.aircraft, entitiesFixture.vessels, trackIndex])

  const activeAlerts = useMemo(() => {
    const currentTime = new Date(frame.timestamp).getTime()
    const windowStart = currentTime - 75 * 60 * 1000
    return alerts
      .filter((alert) => {
        const time = new Date(alert.timestamp).getTime()
        return time <= currentTime && time >= windowStart
      })
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, 18)
  }, [alerts, frame.timestamp])

  return {
    currentIndex,
    frame,
    currentEntities,
    activeAlerts,
    isPlaying,
    isLive: currentIndex === lastIndex && !isPlaying,
    speed,
    setSpeed,
    playPause,
    stepBackward,
    stepForward,
    seek,
    goLive,
  }
}
