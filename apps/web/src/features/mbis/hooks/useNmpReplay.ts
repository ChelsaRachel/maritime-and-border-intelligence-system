import type { INmpAlert, INmpCurrentEntity, INmpEntitiesFixture, INmpReplayFixture, INmpTrackPoint, TCoordinates } from '@/features/mbis/types/nmp.types'
import { useCallback, useEffect, useMemo, useState } from 'react'

export type TNmpReplaySpeed = 1 | 2 | 4

const MAX_CONTINUOUS_JUMP_DEGREES = {
  VESSEL: 1.5,
  AIRCRAFT: 3,
} as const

function approximateDistanceDegrees(start: TCoordinates, end: TCoordinates) {
  const meanLatitude = (start[1] + end[1]) * Math.PI / 360
  return Math.hypot((end[0] - start[0]) * Math.cos(meanLatitude), end[1] - start[1])
}

function latestContinuousTrack(track: INmpTrackPoint[], currentIndex: number, maximumJumpDegrees: number) {
  const endIndex = Math.min(currentIndex, track.length - 1)
  let startIndex = 0
  for (let index = endIndex; index > 0; index -= 1) {
    if (approximateDistanceDegrees(track[index - 1].coordinates, track[index].coordinates) > maximumJumpDegrees) {
      startIndex = index
      break
    }
  }
  return track.slice(startIndex, endIndex + 1)
}

function sampledRoute(track: INmpTrackPoint[]) {
  return track
    .filter((_, index) => index % 8 === 0 || index === track.length - 1)
    .map((trackPoint) => trackPoint.coordinates)
}

export function useNmpReplay(entitiesFixture: INmpEntitiesFixture, replayFixture: INmpReplayFixture, alerts: INmpAlert[]) {
  const lastIndex = replayFixture.replayFrames.length - 1
  // Data belum tersambung ke sumber real-time, jadi NMP default memutar replay
  // 24 jam secara berulang (loop) pada kecepatan 2× agar peta selalu terlihat hidup.
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState<TNmpReplaySpeed>(2)

  useEffect(() => {
    if (!isPlaying) return
    const timer = window.setInterval(() => {
      // Saat mencapai frame terakhir, kembali ke awal alih-alih berhenti (continuous loop).
      setCurrentIndex((index) => (index >= lastIndex ? 0 : index + 1))
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
      const continuousTrack = latestContinuousTrack(vessel.track, trackIndex, MAX_CONTINUOUS_JUMP_DEGREES.VESSEL)
      return {
        id: vessel.id,
        label: vessel.name,
        category: 'VESSEL' as const,
        severity: vessel.severity,
        coordinates: point.coordinates,
        heading: point.heading,
        speed: point.speed,
        trail: continuousTrack.slice(-14).map((trackPoint) => trackPoint.coordinates),
        route: sampledRoute(continuousTrack),
        detail: vessel,
      }
    })
    const aircraftEntities = entitiesFixture.aircraft.map((aircraft) => {
      const point = aircraft.track[Math.min(trackIndex, aircraft.track.length - 1)]
      const continuousTrack = latestContinuousTrack(aircraft.track, trackIndex, MAX_CONTINUOUS_JUMP_DEGREES.AIRCRAFT)
      return {
        id: aircraft.id,
        label: aircraft.callSign,
        category: 'AIRCRAFT' as const,
        severity: aircraft.severity,
        coordinates: point.coordinates,
        heading: point.heading,
        speed: point.speed,
        trail: continuousTrack.slice(-14).map((trackPoint) => trackPoint.coordinates),
        route: sampledRoute(continuousTrack),
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
