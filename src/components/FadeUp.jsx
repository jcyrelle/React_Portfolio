import { useEffect, useState } from 'react';

// Fade-up on load: nagdadagdag ng "animate" class pagkatapos mag-load,
// may delay na depende sa `index` (0.12s bawat isa), tulad ng dati.
export default function FadeUp({ as: Tag = 'div', index = 0, className = '', style, children, ...rest }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <Tag
      className={`${className} fade-up${animate ? ' animate' : ''}`.trim()}
      style={{ animationDelay: `${index * 0.12}s`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}