import Card from './Card.jsx';
import Reveal from './Reveal.jsx';
import { interests } from '../data/portfolio.js';

export default function Interests({ index }) {
  return (
    <Card className="card-interests" index={index}>
      <Reveal as="h2">
        <i className="fa-solid fa-book-open fa-2xs"></i> Beyond Coding
      </Reveal>
      <Reveal as="p" delay={0.15}>{interests}</Reveal>
    </Card>
  );
}
