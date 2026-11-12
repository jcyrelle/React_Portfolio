import useInView from '../hooks/useInView.js';

// Text/element na dahan-dahang lumalabas (fade + slide up) kapag nakita sa screen.
// `delay` (seconds) para sa stagger effect.
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const [ref, inView] = useInView();

  return (
    <Tag
      ref={ref}
      className={`reveal${inView ? ' in-view' : ''} ${className}`.trim()}
      style={{ '--delay': `${delay}s`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}