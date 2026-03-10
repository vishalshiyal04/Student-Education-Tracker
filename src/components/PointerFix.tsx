'use client';

import { useEffect } from 'react';

export function PointerFix() {
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      try {
        (e.target as Element)?.releasePointerCapture?.(e.pointerId);
      } catch {}
    };
    window.addEventListener('pointercancel', handler);
    return () => window.removeEventListener('pointercancel', handler);
  }, []);

  return null;
}