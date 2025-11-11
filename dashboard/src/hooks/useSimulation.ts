import { useState, useEffect, useRef, useCallback } from 'react';
import type { FleetEvent, TripData } from '../types/fleet';
import { getAllEvents } from '../utils/dataLoader';

export function useSimulation(trips: TripData[]) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [currentEvents, setCurrentEvents] = useState<FleetEvent[]>([]);
  const intervalRef = useRef<number | null>(null);
  const allEventsRef = useRef<FleetEvent[]>([]);
  const startTimeRef = useRef<Date | null>(null);

  useEffect(() => {
    if (trips.length > 0) {
      const events = getAllEvents(trips);
      allEventsRef.current = events;
      if (events.length > 0) {
        startTimeRef.current = new Date(events[0].timestamp);
        setCurrentTime(new Date(events[0].timestamp));
      }
    }
  }, [trips]);

  const updateSimulation = useCallback(() => {
    if (!currentTime || !startTimeRef.current) return;

    const allEvents = allEventsRef.current;
    const eventsUpToNow = allEvents.filter(
      event => new Date(event.timestamp) <= currentTime
    );
    
    setCurrentEvents(eventsUpToNow);

    const nextTime = new Date(currentTime.getTime() + 1000 * speed);
    const lastEventTime = allEvents.length > 0 
      ? new Date(allEvents[allEvents.length - 1].timestamp)
      : currentTime;

    if (nextTime > lastEventTime) {
      setIsPlaying(false);
      setCurrentTime(lastEventTime);
    } else {
      setCurrentTime(nextTime);
    }
  }, [currentTime, speed]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(updateSimulation, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, updateSimulation]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  
  const reset = useCallback(() => {
    setIsPlaying(false);
    if (startTimeRef.current) {
      setCurrentTime(new Date(startTimeRef.current));
      setCurrentEvents([]);
    }
  }, []);

  const changeSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  const skipTo = useCallback((progress: number) => {
    const allEvents = allEventsRef.current;
    if (allEvents.length === 0 || !startTimeRef.current) return;

    const lastEventTime = new Date(allEvents[allEvents.length - 1].timestamp);
    const startTime = startTimeRef.current.getTime();
    const endTime = lastEventTime.getTime();
    const targetTime = new Date(startTime + (endTime - startTime) * progress);
    
    setCurrentTime(targetTime);
    
    const eventsUpToTarget = allEvents.filter(
      event => new Date(event.timestamp) <= targetTime
    );
    setCurrentEvents(eventsUpToTarget);
  }, []);

  const totalDuration = allEventsRef.current.length > 0 && startTimeRef.current
    ? new Date(allEventsRef.current[allEventsRef.current.length - 1].timestamp).getTime() - 
      startTimeRef.current.getTime()
    : 0;

  const elapsedTime = currentTime && startTimeRef.current
    ? currentTime.getTime() - startTimeRef.current.getTime()
    : 0;

  const progress = totalDuration > 0 ? elapsedTime / totalDuration : 0;

  return {
    isPlaying,
    speed,
    currentTime,
    currentEvents,
    progress,
    play,
    pause,
    reset,
    changeSpeed,
    skipTo
  };
}
