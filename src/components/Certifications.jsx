import { useState } from 'react';
import Card from './Card.jsx';
import FadeUp from './FadeUp.jsx';
import Reveal from './Reveal.jsx';
import useInView from '../hooks/useInView.js';
import { certifications, certificationsSubtitle } from '../data/portfolio.js';

// Preview ng certificate. Kapag na-click, bubukas ang PDF sa bagong tab.
// Kapag wala pa o hindi ma-load ang larawan, placeholder ang ipapakita.
function CertPreview({ src, href, title }) {
  const [failed, setFailed] = useState(false);
  const Tag = href ? 'a' : 'div';
  const linkProps = href
    ? {
        href,
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label': `View ${title} certificate`,
      }
    : {};

  return (
    <Tag className="cert-preview" {...linkProps}>
      {src && !failed ? (
        <img src={src} alt={`${title} certificate`} onError={() => setFailed(true)} />
      ) : (
        <div className="cert-preview-fallback">
          <i className="fa-solid fa-award"></i>
          <span>Certificate preview</span>
        </div>
      )}
    </Tag>
  );
}

function CertCard({ cert }) {
  const [tagsRef, tagsInView] = useInView();

  // Ang Credential button: PDF kung meron, kung wala ay Credly link
  const credentialHref = cert.credentialFile || cert.credential;

  // Pangalan ng file kapag dina-download (halimbawa: Networking-Basics-Certificate.pdf)
  const ext = cert.certificate ? cert.certificate.split('.').pop() : 'pdf';
  const downloadName = `${cert.title.replace(/\s+/g, '-')}-Certificate.${ext}`;

  return (
    <Card className="cert-card">
      <CertPreview src={cert.preview} href={cert.certificate} title={cert.title} />

      <div className="cert-info">
        <div className="cert-head">
          <a
            href={cert.credential}
            target="_blank"
            rel="noopener noreferrer"
            className="cert-badge-link"
            aria-label={`${cert.title} badge on Credly`}
          >
            <img src={cert.badge} alt={`${cert.title} badge`} className="cert-badge" />
          </a>
          <div>
            <h3 className="cert-title">{cert.title}</h3>
            <p className="cert-issuer">{cert.issuer}</p>
            {cert.issued && <p className="cert-issued">Issued {cert.issued}</p>}
          </div>
        </div>

        <ul ref={tagsRef} className={`cert-tags${tagsInView ? ' in-view' : ''}`}>
          {cert.tags.map((tag, i) => (
            <li key={tag} style={{ '--d': `${0.2 + i * 0.08}s` }}>
              {tag}
            </li>
          ))}
        </ul>

        <div className="cert-actions">
          {cert.certificate && (
            <a
              className="cert-btn solid"
              href={cert.certificate}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-solid fa-file-lines"></i> Certificate
            </a>
          )}
          <a
            className="cert-btn"
            href={credentialHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-regular fa-circle-check"></i> Credential
          </a>
          {cert.certificate && (
            <a
              className="cert-icon-btn"
              href={cert.certificate}
              download={downloadName}
              aria-label={`Download ${cert.title} certificate`}
              title="Download certificate"
            >
              <i className="fa-solid fa-download"></i>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function Certifications({ index }) {
  return (
    <FadeUp className="card-certifications" index={index} id="certificates">
      <Reveal as="h2">
        <i className="fa-solid fa-certificate fa-2xs"></i> Certificates &amp; Badges
      </Reveal>
      <Reveal as="p" delay={0.1} className="certs-subtitle">
        {certificationsSubtitle}
      </Reveal>

      <div className="cert-list">
        {certifications.map((cert, i) => (
          <Reveal key={cert.title} delay={0.15 + i * 0.15}>
            <CertCard cert={cert} />
          </Reveal>
        ))}
      </div>
    </FadeUp>
  );
}