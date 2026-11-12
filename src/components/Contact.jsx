import Card from './Card.jsx';
import Reveal from './Reveal.jsx';
import { contactIntro, socials } from '../data/portfolio.js';

export default function Contact({ index }) {
  return (
    <Card className="card-contact" index={index} id="contact">
      <Reveal as="h2">
        <i className="fa-solid fa-paper-plane fa-2xs"></i> Get in Touch
      </Reveal>

      <Reveal as="p" delay={0.15} className="contact-intro">
        {contactIntro}
      </Reveal>

      <div className="social-links">
        {socials.map((s, i) => (
          <Reveal key={s.name} delay={0.3 + i * 0.12} className="social-item">
            <a
              href={s.link}
              className={`social-link ${s.className}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.name}
            >
              <span className="social-icon">
                <i className={s.icon}></i>
              </span>
              <span className="social-name">{s.name}</span>
            </a>
          </Reveal>
        ))}
      </div>
    </Card>
  );
}