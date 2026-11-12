import { useEffect, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Tina-type at binubura ang bawat salita sa `words`, paikot-ikot.
export default function Typewriter({
  words,
  typeSpeed = 85,
  deleteSpeed = 45,
  pause = 1600,
}) {
  const [reduced] = useState(prefersReducedMotion);
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) return undefined;

    const current = words[wordIndex];
    const finishedTyping = !deleting && text === current;
    const finishedDeleting = deleting && text === '';

    let delay = deleting ? deleteSpeed : typeSpeed;
    if (finishedTyping) delay = pause;
    if (finishedDeleting) delay = 350;

    const id = setTimeout(() => {
      if (finishedTyping) {
        setDeleting(true);
      } else if (finishedDeleting) {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      } else {
        setText(
          deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1)
        );
      }
    }, delay);

    return () => clearTimeout(id);
  }, [text, deleting, wordIndex, words, typeSpeed, deleteSpeed, pause, reduced]);

  // Para sa mga ayaw ng animation: static na text lang
  if (reduced) return <span>{words.join(' · ')}</span>;

  return (
    <span aria-label={words.join(', ')}>
      <span aria-hidden="true">{text}</span>
      <span className="caret" aria-hidden="true"></span>
    </span>
  );
}