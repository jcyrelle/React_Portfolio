import { useEffect, useRef } from 'react';

// Dotted na background ng buong page.
// May mga tuldok na nakalatag, at ang mga tuldok na malapit sa mouse ay lumiliwanag.
export default function DotBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let frame = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      frame = 0;
      el.style.setProperty('--px', `${x}px`);
      el.style.setProperty('--py', `${y}px`);
    };

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      el.classList.add('is-active');
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => el.classList.remove('is-active');

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="dot-bg" aria-hidden="true">
      <div className="dot-bg-base"></div>
      <div className="dot-bg-glow"></div>
    </div>
  );
}