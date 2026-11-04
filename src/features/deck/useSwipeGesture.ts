import { useState, useRef, useEffect, useCallback } from 'react';
import { useMobileFrame } from '../../components/MobileFrame';

interface UseSwipeGestureProps {
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  onSwipeUp?: () => void;
  idleTimeoutMs?: number;
}

export function useSwipeGesture({
  onSwipeRight,
  onSwipeLeft,
  onSwipeUp,
  idleTimeoutMs = 3500,
}: UseSwipeGestureProps) {
  const { scale: frameScale } = useMobileFrame();
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isNudging, setIsNudging] = useState(false);

  const startPosRef = useRef({ x: 0, y: 0 });
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop idle animation and reset idle countdown
  const resetIdleTimer = useCallback(() => {
    setIsNudging(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setIsNudging(true);
    }, idleTimeoutMs);
  }, [idleTimeoutMs]);

  // Global listener: Cancel nudge instantly on ANY user activity (movement, click, keydown)
  useEffect(() => {
    const handleUserActivity = () => {
      setIsNudging(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setIsNudging(true);
      }, idleTimeoutMs);
    };

    window.addEventListener('mousemove', handleUserActivity, { passive: true });
    window.addEventListener('pointermove', handleUserActivity, { passive: true });
    window.addEventListener('pointerdown', handleUserActivity, { passive: true });
    window.addEventListener('keydown', handleUserActivity, { passive: true });
    window.addEventListener('touchstart', handleUserActivity, { passive: true });

    // Initial timeout for idle detection
    idleTimerRef.current = setTimeout(() => {
      setIsNudging(true);
    }, idleTimeoutMs);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('pointermove', handleUserActivity);
      window.removeEventListener('pointerdown', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
    };
  }, [idleTimeoutMs]);

  const handleDragStart = (clientX: number, clientY: number) => {
    // Instantly cancel idle nudge animation and timer
    setIsNudging(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    setIsDragging(true);
    startPosRef.current = { x: clientX, y: clientY };
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) {
      resetIdleTimer();
      return;
    }
    const currentScale = frameScale > 0 ? frameScale : 1;
    const deltaX = (clientX - startPosRef.current.x) / currentScale;
    const deltaY = (clientY - startPosRef.current.y) / currentScale;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset.x > 90) {
      onSwipeRight();
    } else if (dragOffset.x < -90) {
      onSwipeLeft();
    } else if (dragOffset.y < -120 && onSwipeUp) {
      onSwipeUp();
    } else {
      setDragOffset({ x: 0, y: 0 });
    }

    resetIdleTimer();
  };

  // Rotation and stamp calculations
  const rotation = isNudging ? 0 : dragOffset.x * 0.07;
  const matchOpacity = Math.min(Math.max((dragOffset.x - 20) / 70, 0), 1);
  const passOpacity = Math.min(Math.max((-dragOffset.x - 20) / 70, 0), 1);

  return {
    dragOffset,
    setDragOffset,
    isDragging,
    isNudging,
    resetIdleTimer,
    rotation,
    matchOpacity,
    passOpacity,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
}
