import Card from './Card.jsx';
import Reveal from './Reveal.jsx';
import useInView from '../hooks/useInView.js';
import { techStack } from '../data/portfolio.js';

export default function TechStack({ index }) {
  const [ref, inView] = useInView();

  return (
    <Card className="card-tech" index={index}>
      <Reveal as="h2">
        <i className="fa-solid fa-code fa-2xs"></i> Tech Stack
      </Reveal>
      <div ref={ref} className={`tech-stack${inView ? ' in-view' : ''}`}>
        {techStack.map((tech, i) => (
          <span key={tech} style={{ '--d': `${0.15 + i * 0.07}s` }}>
            {tech}
          </span>
        ))}
      </div>
    </Card>
  );
}