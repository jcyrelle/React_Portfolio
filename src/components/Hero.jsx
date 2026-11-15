import Card from './Card.jsx';
import Reveal from './Reveal.jsx';
import Typewriter from './Typewriter.jsx';
import useInView from '../hooks/useInView.js';
import { profile } from '../data/portfolio.js';

export default function Hero({ index }) {
  // Pangalan ng file kapag dina-download (halimbawa: John-Cyrelle-Albarracin-Resume.pdf)
  const resumeName = `${profile.name.replace(/\s+/g, '-')}-Resume.pdf`;
  const [nameRef, nameInView] = useInView();

  return (
    <Card className="card-hero" index={index}>
      <Reveal as="img" delay={0.1} src={profile.image} alt="Profile" className="profile-img" />
      {/* Ang bawat salita ng pangalan ay umaakyat mula sa likod ng maskara */}
      <h1
        ref={nameRef}
        className={`hero-name${nameInView ? ' in-view' : ''}`}
        aria-label={profile.name}
      >
        {profile.name.split(' ').map((word, i) => (
          <span key={`${word}-${i}`}>
            <span className="hero-word" aria-hidden="true">
              <span style={{ '--i': i }}>{word}</span>
            </span>{' '}
          </span>
        ))}
      </h1>
      <Reveal as="p" delay={0.4} className="role">
        <Typewriter words={profile.roles} />
      </Reveal>
      <Reveal as="p" delay={0.55} className="location">
        <i className="fa-solid fa-location-dot"></i> {profile.location}
      </Reveal>
      <Reveal as="p" delay={0.7} className="tagline">{profile.tagline}</Reveal>
      <Reveal delay={0.85} className="hero-actions">
        <a className="cert-btn solid" href={profile.resume} download={resumeName}>
          <i className="fa-solid fa-download"></i> Download Resume
        </a>
        <a className="cert-btn" href="#contact">
          <i className="fa-solid fa-paper-plane"></i> Get in Touch
        </a>
      </Reveal>
    </Card>
  );
}