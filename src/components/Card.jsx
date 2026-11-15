import { useState } from 'react';
import FadeUp from './FadeUp.jsx';

const reduceMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Sinusundan ng spotlight (malabong liwanag sa loob ng card) ang mouse.
// Ang posisyon ay sine-save bilang CSS variables na --mx at --my.
function handleMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
}

// 3D tilt: bahagyang tumatagilid ang card ayon sa posisyon ng mouse.
// Mas maliit ang tilt sa malalapad na card para hindi sobra ang galaw.
function handleTilt(e) {
  if (reduceMotion()) return;
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width - 0.5;
  const py = (e.clientY - rect.top) / rect.height - 0.5;
  const max = rect.width > 700 ? 1.2 : 5;
  el.style.setProperty('--rx', `${(-py * max * 2).toFixed(2)}deg`);
  el.style.setProperty('--ry', `${(px * max * 2).toFixed(2)}deg`);
}

function resetTilt(e) {
  e.currentTarget.style.setProperty('--rx', '0deg');
  e.currentTarget.style.setProperty('--ry', '0deg');
}

// Card na may hover lift (dating "CARD HOVER LIFT" sa script.js) at spotlight.
// Kapag may `index`, may fade-up din; kung wala, may 3D tilt din (project, certificate, experience).
export default function Card({ className = '', index, children, ...rest }) {
  const [lifted, setLifted] = useState(false);
  const tilts = index === undefined;

  const hoverProps = {
    onMouseEnter: () => setLifted(true),
    onMouseLeave: (e) => {
      setLifted(false);
      if (tilts) resetTilt(e);
    },
    onMouseMove: (e) => {
      handleMove(e);
      if (tilts) handleTilt(e);
    },
    style: {
      transform: tilts
        ? `perspective(1000px) translateY(${lifted ? '-4px' : '0px'}) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))`
        : lifted
        ? 'translateY(-4px)'
        : 'translateY(0)',
      transition: '0.3s ease',
    },
  };

  if (!tilts) {
    return (
      <FadeUp className={`card ${className}`.trim()} index={index} {...hoverProps} {...rest}>
        {children}
      </FadeUp>
    );
  }

  return (
    <div className={`card ${className}`.trim()} {...hoverProps} {...rest}>
      {children}
    </div>
  );
}