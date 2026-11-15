import { useEffect, useState } from 'react';
import { profile } from '../data/portfolio.js';

const HOLD = 3600; // gaano katagal bago magsimulang kumupas (ms)
const EXIT = 800; // tagal ng pagkupas (ms)
export const INTRO_KEY = 'portfolio-intro-seen';

// Maliit na intro screen: lumalabas ang initials, tapos kumukupas papunta sa portfolio.
// onReveal: tinatawag pagsisimula ng pagkupas (dito lumalabas ang laman ng page)
// onDone: tinatawag pagkatapos mawala ang intro
export default function Intro({ onReveal, onDone }) {
  const [leaving, setLeaving] = useState(false);

  // Unang letra ng unang dalawang pangalan (halimbawa: John Cyrelle -> JC)
  const initials = profile.name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('');

  useEffect(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* ignore */
    }

    // Hindi puwedeng mag-scroll habang nagpe-play ang intro
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';

    const t1 = setTimeout(() => {
      setLeaving(true);
      onReveal();
    }, HOLD);
    const t2 = setTimeout(() => {
      root.style.overflow = previous;
      onDone();
    }, HOLD + EXIT);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      root.style.overflow = previous;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`intro${leaving ? ' leaving' : ''}`} aria-hidden="true">
      <div className="intro-mark">
        {initials.split('').map((letter, i) => (
          <span className="intro-letter" key={`${letter}-${i}`}>
            <span style={{ '--i': i }}>{letter}</span>
          </span>
        ))}
      </div>
      <div className="intro-line"></div>
      <p className="intro-name">{profile.name}</p>
    </div>
  );
}