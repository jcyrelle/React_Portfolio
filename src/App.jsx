import { useState } from 'react';
import useTheme from './hooks/useTheme.js';
import FadeUp from './components/FadeUp.jsx';
import DotBackground from './components/DotBackground.jsx';
import Intro, { INTRO_KEY } from './components/Intro.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import SiteNav from './components/SiteNav.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Education from './components/Education.jsx';
import TechStack from './components/TechStack.jsx';
import Projects from './components/Projects.jsx';
import Experience from './components/Experience.jsx';
import Certifications from './components/Certifications.jsx';
import GitHubActivity from './components/GitHubActivity.jsx';
import Contact from './components/Contact.jsx';
import VisitorCounter from './components/VisitorCounter.jsx';
import { profile } from './data/portfolio.js';

// Lalabas ang intro isang beses bawat pagbisita (session).
// Hindi ito lalabas kapag naka-"reduce motion" ang device.
function shouldShowIntro() {
  if (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return false;
  }
  try {
    return sessionStorage.getItem(INTRO_KEY) !== '1';
  } catch {
    return true;
  }
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [showIntro, setShowIntro] = useState(shouldShowIntro);
  const [ready, setReady] = useState(!showIntro);

  return (
    <>
      <DotBackground />

      {showIntro && (
        <Intro onReveal={() => setReady(true)} onDone={() => setShowIntro(false)} />
      )}

      {ready && (
        <>
          <ScrollProgress />
          <SiteNav />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />

          <main className="portfolio-grid">
            <Hero index={0} />
            <About index={1} />
            <Education index={2} />
            <TechStack index={3} />
            <Projects index={4} />
            <Experience index={5} />
            <Certifications index={6} />
            <GitHubActivity index={7} />
            <Contact index={8} />
          </main>

          <FadeUp as="footer" index={9}>
            © 2026 {profile.name}. All rights reserved.
            <VisitorCounter />
          </FadeUp>
        </>
      )}
    </>
  );
}