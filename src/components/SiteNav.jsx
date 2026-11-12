import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { navItems, profile } from '../data/portfolio.js';

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function SiteNav() {
  const [active, setActive] = useState(navItems[0].id);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [ready, setReady] = useState(false);
  const listRef = useRef(null);
  const linkRefs = useRef({});

  // Unang letra ng unang dalawang pangalan (halimbawa: John Cyrelle -> JC)
  const initials = profile.name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('');

  // SCROLL-SPY: alin sa mga section ang nasa itaas na bahagi ng screen
  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const line = window.innerHeight * 0.35;
      let current = navItems[0].id;

      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) current = item.id;
      }

      // Kapag nasa pinakadulo na ng page, ang huling link (Contact) ang naka-highlight
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = navItems[navItems.length - 1].id;

      setActive(current);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Posisyon at lapad ng gumagalaw na pill sa likod ng active na link
  useLayoutEffect(() => {
    const measure = () => {
      const link = linkRefs.current[active];
      if (link) setIndicator({ left: link.offsetLeft, width: link.offsetWidth });
    };

    measure();
    window.addEventListener('resize', measure);
    // Sukatin ulit kapag na-load na ang font, dahil nagbabago ang lapad ng mga link
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [active]);

  // Sa maliit na screen, i-center ang active na link sa loob ng nav
  useEffect(() => {
    const list = listRef.current;
    const link = linkRefs.current[active];
    if (!list || !link) return;
    const target = link.offsetLeft - list.clientWidth / 2 + link.offsetWidth / 2;
    list.scrollTo({
      left: Math.max(0, target),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, [active]);

  // Para hindi mag-slide mula sa kaliwa pagbukas ng page
  useEffect(() => {
    let inner;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setReady(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, []);

  const behavior = () => (prefersReducedMotion() ? 'auto' : 'smooth');

  const goTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: behavior(), block: 'start' });
  };

  const goTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: behavior() });
  };

  return (
    <nav className="site-nav" aria-label="Primary">
      <a className="site-nav-brand" href="#top" onClick={goTop} aria-label="Back to top">
        {initials}
      </a>

      <div ref={listRef} className="site-nav-list">
        <span
          className={`site-nav-indicator${ready ? ' ready' : ''}`}
          style={{ left: indicator.left, width: indicator.width }}
          aria-hidden="true"
        ></span>

        {navItems.map((item) => (
          <a
            key={item.id}
            ref={(el) => {
              linkRefs.current[item.id] = el;
            }}
            href={`#${item.id}`}
            className={`site-nav-link${active === item.id ? ' active' : ''}`}
            aria-current={active === item.id ? 'true' : undefined}
            onClick={(e) => goTo(e, item.id)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}