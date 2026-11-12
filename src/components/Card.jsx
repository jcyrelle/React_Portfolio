import { useState } from 'react';
import FadeUp from './FadeUp.jsx';

// Sinusundan ng spotlight (malabong liwanag sa loob ng card) ang mouse.
// Ang posisyon ay sine-save bilang CSS variables na --mx at --my.
function handleMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
}

// Card na may hover lift (dating "CARD HOVER LIFT" sa script.js) at spotlight.
// Kapag may `index`, may fade-up din; kung wala, simpleng div lang.
export default function Card({ className = '', index, children, ...rest }) {
  const [lifted, setLifted] = useState(false);

  const hoverProps = {
    onMouseEnter: () => setLifted(true),
    onMouseLeave: () => setLifted(false),
    onMouseMove: handleMove,
    style: {
      transform: lifted ? 'translateY(-4px)' : 'translateY(0)',
      transition: '0.3s ease',
    },
  };

  if (index === undefined) {
    return (
      <div className={`card ${className}`.trim()} {...hoverProps} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <FadeUp className={`card ${className}`.trim()} index={index} {...hoverProps} {...rest}>
      {children}
    </FadeUp>
  );
}