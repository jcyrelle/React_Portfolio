import { useEffect, useRef, useState } from 'react';
import { visitorCounter } from '../data/portfolio.js';

const SESSION_KEY = 'portfolio-visit-counted';

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Dahan-dahang tumataas ang numero papunta sa bagong bilang
function useAnimatedNumber(target) {
  const [display, setDisplay] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    if (target === null) return undefined;
    if (current.current === null || prefersReducedMotion()) {
      current.current = target;
      setDisplay(target);
      return undefined;
    }

    const from = current.current;
    const start = performance.now();
    const duration = 900;
    let frame = 0;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(from + (target - from) * eased);
      current.current = value;
      setDisplay(value);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return display;
}

// Live na bilang ng bisita. Gumagamit ng Firebase Realtime Database.
// Kapag walang `databaseURL` sa src/data/portfolio.js, walang ipapakita.
export default function VisitorCounter() {
  const base = (visitorCounter.databaseURL || '').replace(/\/+$/, '');
  const [count, setCount] = useState(null);
  const shown = useAnimatedNumber(count);

  useEffect(() => {
    if (!base) return undefined;
    const url = `${base}/visits.json`;

    // 1. Dagdagan ng 1 ang bilang, isang beses lang bawat pagbisita (bawat session).
    //    Hindi ito binibilang kapag nasa localhost (para hindi tumaas habang nag-eedit ka).
    const isLocal = ['localhost', '127.0.0.1', '[::1]', ''].includes(window.location.hostname);
    let alreadyCounted = false;
    try {
      alreadyCounted = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      /* ignore */
    }

    if (!isLocal && !alreadyCounted) {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* ignore */
      }
      fetch(url, {
        method: 'PUT',
        body: JSON.stringify({ '.sv': { increment: 1 } }),
      }).catch(() => {});
    }

    // 2. Live na pakikinig: tuwing may bumisita, awtomatikong magbabago ang numero
    let source;
    try {
      source = new EventSource(url);
    } catch {
      return undefined;
    }

    const onPut = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg && msg.path === '/' && typeof msg.data === 'number') setCount(msg.data);
      } catch {
        /* ignore */
      }
    };
    source.addEventListener('put', onPut);

    return () => {
      source.removeEventListener('put', onPut);
      source.close();
    };
  }, [base]);

  if (!base || count === null) return null;

  return (
    <div className="visitor-wrap">
      <div className="visitor-pill" title="Live visitor count">
        <span className="visitor-dot" aria-hidden="true"></span>
        <span className="visitor-live">Live</span>
        <span className="visitor-sep" aria-hidden="true"></span>
        <span className="visitor-num">{(shown ?? count).toLocaleString()}</span>
        <span className="visitor-label">visitors</span>
      </div>
    </div>
  );
}