import { useState } from 'react';
import Card from './Card.jsx';
import Reveal from './Reveal.jsx';
import { education } from '../data/portfolio.js';

// Logo ng school. Kapag wala pa o hindi ma-load ang image, initials ang ipapakita.
function SchoolLogo({ src, name, initials }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="school-logo school-logo-fallback" aria-hidden="true">
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} logo`}
      className="school-logo"
      onError={() => setFailed(true)}
    />
  );
}

export default function Education({ index }) {
  return (
<Card className="card-education" index={index} id="education">
      <Reveal as="h2">
        <i className="fa-solid fa-graduation-cap fa-2xs"></i> Education
      </Reveal>
      <ul className="education-list">
        {education.map((item, i) => (
          <Reveal
            as="li"
            key={item.school}
            className="education-item"
            delay={0.15 + i * 0.15}
          >
            <SchoolLogo src={item.logo} name={item.school} initials={item.initials} />
            <div className="education-info">
              <div className="education-level">
                <span className="education-label">{item.level}</span>
                {item.current && <span className="education-badge">Current</span>}
              </div>
              <h3 className="education-school">{item.school}</h3>
              <p className="education-degree">{item.program}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Card>
  );
}