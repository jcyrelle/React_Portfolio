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

  // Smooth na pagpalit ng theme: dahan-dahang nagfe-fade ang buong page.
  // Kapag hindi suportado ng browser (o naka-"reduce motion"), instant na lang.
  // Kapag manual na pinalitan ng bisita, hanggang sa susunod na pagpalit ng umaga/gabi iyon.
  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';

    const apply = () => {
      document.documentElement.setAttribute('data-theme', next);
      flushSync(() => setTheme(next));
    };

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof document.startViewTransition === 'function' && !reduceMotion) {
      document.startViewTransition(apply);
    } else {
      setTheme(next);
    }
  };

  return { theme, toggleTheme };
}