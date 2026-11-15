import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

// Oras ng araw (ayon sa oras ng device ng bisita):
// 6:00 AM - 5:59 PM = light mode, 6:00 PM - 5:59 AM = dark mode
const DAY_START = 6;
const NIGHT_START = 18;

function themeForNow() {
  const hour = new Date().getHours();
  return hour >= DAY_START && hour < NIGHT_START ? 'light' : 'dark';
}

export default function useTheme() {
  const [theme, setTheme] = useState(themeForNow);
  const autoRef = useRef(theme); // huling theme na napili ng orasan

  // useLayoutEffect para walang kisap na light bago mag-dark kapag gabi
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Binabantayan ang oras. Pagpalit ng umaga/gabi, kusa ring magpapalit ang theme.
  useEffect(() => {
    const check = () => {
      const now = themeForNow();
      if (now !== autoRef.current) {
        autoRef.current = now;
        setTheme(now);
      }
    };
    const id = setInterval(check, 30 * 1000);
    document.addEventListener('visibilitychange', check);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', check);
    };
  }, []);

  // Pagpalit ng theme na may transition:
  // - Sa browser na may View Transitions: lumalaki ang bilog mula sa toggle button
  //   hanggang matakpan ang buong page ng bagong theme.
  // - Sa ibang browser: dahan-dahang nagbabago ang mga kulay (fade).
  // - Kapag naka-"reduce motion" ang device: instant na lang.
  // Kapag manual na pinalitan ng bisita, hanggang sa susunod na pagpalit ng umaga/gabi iyon.
  const toggleTheme = (event) => {
    const next = theme === 'light' ? 'dark' : 'light';

    const apply = () => {
      document.documentElement.setAttribute('data-theme', next);
      flushSync(() => setTheme(next));
    };

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      setTheme(next);
      return;
    }

    if (typeof document.startViewTransition === 'function') {
      // Saan nagsisimula ang bilog: sa gitna ng toggle button
      const box =
        event && event.currentTarget && event.currentTarget.getBoundingClientRect
          ? event.currentTarget.getBoundingClientRect()
          : null;
      const x = box ? box.left + box.width / 2 : window.innerWidth - 50;
      const y = box ? box.top + box.height / 2 : 35;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(apply);
      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${radius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 700,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        })
        .catch(() => {});
      return;
    }

    // Fallback: fade ng mga kulay
    const root = document.documentElement;
    root.classList.add('theme-fading');
    setTheme(next);
    setTimeout(() => root.classList.remove('theme-fading'), 700);
  };

  return { theme, toggleTheme };
}