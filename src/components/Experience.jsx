import { useState } from 'react';
import Card from './Card.jsx';
import FadeUp from './FadeUp.jsx';
import Reveal from './Reveal.jsx';
import useInView from '../hooks/useInView.js';
import { experience } from '../data/portfolio.js';

// Larawan sa kaliwa ng card. Kapag wala pa o hindi ma-load, placeholder ang ipapakita.
function ExpPhoto({ src, alt }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="exp-photo">
      {src && !failed ? (
        <img src={src} alt={alt} onError={() => setFailed(true)} />
      ) : (
        <div className="exp-photo-fallback">
          <i className="fa-solid fa-image"></i>
          <span>Photo</span>
        </div>
      )}
    </div>
  );
}

function ExpCard({ item }) {
  const [pointsRef, pointsInView] = useInView();
  const [tagsRef, tagsInView] = useInView();
  const hasPhoto = Boolean(item.photo);

  return (
    <Card className={`exp-card${hasPhoto ? '' : ' no-photo'}`}>
      {hasPhoto && <ExpPhoto src={item.photo} alt={`${item.role} at ${item.org}`} />}

      <div className="exp-info">
        <div className="exp-meta">
          <span className="exp-label">{item.label}</span>
          <span className="exp-period">{item.period}</span>
        </div>

        <h3 className="exp-role">{item.role}</h3>
        <p className="exp-org">
          <i className="fa-solid fa-building"></i>
          {item.org} · {item.location}
        </p>

        <ul ref={pointsRef} className={`exp-points${pointsInView ? ' in-view' : ''}`}>
          {item.points.map((point, i) => (
            <li key={point} style={{ '--d': `${0.1 + i * 0.12}s` }}>
              {point}
            </li>
          ))}
        </ul>

        {/* Parehong style at animation ng tags sa Certificates */}
        <ul ref={tagsRef} className={`cert-tags${tagsInView ? ' in-view' : ''}`}>
          {item.tags.map((tag, i) => (
            <li key={tag} style={{ '--d': `${0.2 + i * 0.08}s` }}>
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

export default function Experience({ index }) {
  return (
<FadeUp className="card-experience" index={index} id="experience">
      <Reveal as="h2">
        <i className="fa-solid fa-briefcase fa-2xs"></i> Experience
      </Reveal>

      <div className="exp-list">
        {experience.map((item, i) => (
          <Reveal key={`${item.org}-${item.role}`} delay={0.15 + i * 0.15}>
            <ExpCard item={item} />
          </Reveal>
        ))}
      </div>
    </FadeUp>
  );
}