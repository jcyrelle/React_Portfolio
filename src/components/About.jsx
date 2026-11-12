import Card from './Card.jsx';
import Reveal from './Reveal.jsx';
import { about } from '../data/portfolio.js';

export default function About({ index }) {
  return (
    <Card className="card-about" index={index} id="about">
      <Reveal as="h2">
        <i className="fa-solid fa-user fa-2xs"></i> About Me
      </Reveal>
      {about.map((text, i) => (
        <Reveal as="p" key={text} delay={0.15 + i * 0.15}>
          {text}
        </Reveal>
      ))}
    </Card>
  );
}