import { useEffect, useState } from 'react';
import Card from './Card.jsx';
import FadeUp from './FadeUp.jsx';
import Reveal from './Reveal.jsx';
import useInView from '../hooks/useInView.js';
import { projects } from '../data/portfolio.js';

// Sinusundan kung dark mode ba ang page (nagbabago ang data-theme sa <html>)
function useIsDark() {
  const [dark, setDark] = useState(
    () => document.documentElement.getAttribute('data-theme') === 'dark'
  );

  useEffect(() => {
    const el = document.documentElement;
    const update = () => setDark(el.getAttribute('data-theme') === 'dark');
    update();
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return dark;
}

// Maliit na logo ng project. Kapag wala pa o hindi ma-load, unang letra ng pangalan ang ipapakita.
// darkFlip: para sa logo na puti ang background. Sa dark mode, gagawin itong itim.
function ProjectLogo({ src, title, fit, darkFlip }) {
  const [failed, setFailed] = useState(false);
  const isDark = useIsDark();

  if (!src || failed) {
    return (
      <div className="project-logo project-logo-fallback" aria-hidden="true">
        {title.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${title} logo`}
      className="project-logo"
      style={{
        objectFit: fit || 'contain',
        filter: darkFlip && isDark ? 'invert(0.96) hue-rotate(180deg)' : 'none',
      }}
      onError={() => setFailed(true)}
    />
  );
}

function ProjectCard({ project }) {
  const [tagsRef, tagsInView] = useInView();

  return (
    <Card className="project">
      <div className="project-head">
        <ProjectLogo
          src={project.logo}
          title={project.title}
          fit={project.logoFit}
          darkFlip={project.logoDarkFlip}
        />
        <h3 className="project-title">{project.title}</h3>
      </div>

      <p>{project.description}</p>

      {/* Parehong style at animation ng tags sa Certificates */}
      <ul ref={tagsRef} className={`cert-tags${tagsInView ? ' in-view' : ''}`}>
        {project.tags.map((tag, i) => (
          <li key={tag} style={{ '--d': `${0.2 + i * 0.08}s` }}>
            {tag}
          </li>
        ))}
      </ul>
    </Card>
  );
}

// Para magdagdag ng project, i-edit lang ang `projects` array sa src/data/portfolio.js
export default function Projects({ index }) {
  return (
<FadeUp className="projects-wrapper" index={index} id="projects">
      <Reveal as="h2">
        <i className="fa-solid fa-layer-group fa-2xs"></i> Recent Projects
      </Reveal>
      <div className="projects-grid">
        {projects.map((project, i) => (
          <Reveal key={project.title} className="project-slot" delay={0.15 + i * 0.15}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </FadeUp>
  );
}