import useTheme from './hooks/useTheme.js';
import FadeUp from './components/FadeUp.jsx';
import DotBackground from './components/DotBackground.jsx';
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
import Contact from './components/Contact.jsx';
import VisitorCounter from './components/VisitorCounter.jsx';
import { profile } from './data/portfolio.js';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <DotBackground />
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
        <Contact index={7} />
      </main>

      <FadeUp as="footer" index={8}>
        © 2026 {profile.name}. All rights reserved.
        <VisitorCounter />
      </FadeUp>
    </>
  );
}