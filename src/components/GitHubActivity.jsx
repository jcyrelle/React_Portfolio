import { useEffect, useMemo, useRef, useState } from 'react';
import Card from './Card.jsx';
import FadeUp from './FadeUp.jsx';
import Reveal from './Reveal.jsx';
import useInView from '../hooks/useInView.js';
import { githubActivity } from '../data/portfolio.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

// Numero na dahan-dahang tumataas hanggang sa tamang bilang
function useCountUp(target, run) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!run) return undefined;
    if (prefersReducedMotion()) {
      setValue(target);
      return undefined;
    }

    const start = performance.now();
    const duration = 1200;
    let frame = 0;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, run]);

  return value;
}

// Total, pinakamahabang sunod-sunod na araw, at bilang ng araw na may contribution
function getStats(days) {
  let total = 0;
  let active = 0;
  let longest = 0;
  let run = 0;

  for (const day of days) {
    total += day.count;
    if (day.count > 0) {
      active += 1;
      run += 1;
      if (run > longest) longest = run;
    } else {
      run = 0;
    }
  }
  return { total, active, longest };
}

// Hinahati ang mga araw sa mga linggo (Linggo ang simula ng bawat hanay)
function getWeeks(days) {
  const pad = new Date(`${days[0].date}T00:00:00`).getDay();
  const cells = [...Array(pad).fill(null), ...days];
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

// Pangalan ng buwan sa itaas ng unang linggo ng bawat buwan
function getMonthLabels(weeks) {
  const labels = [];
  let last = -1;

  weeks.forEach((week, w) => {
    const first = week.find(Boolean);
    if (!first) return;
    const month = parseInt(first.date.slice(5, 7), 10) - 1;
    if (month !== last) {
      labels.push({ w, name: MONTHS[month] });
      last = month;
    }
  });

  // Kapag kakaunti ang espasyo sa unang label, alisin para hindi magsiksikan
  if (labels.length > 1 && labels[1].w - labels[0].w < 3) labels.shift();
  return labels;
}

export default function GitHubActivity({ index }) {
  const username = githubActivity.username;
  const profileUrl = `https://github.com/${username}`;

  const [days, setDays] = useState(null);
  const [failed, setFailed] = useState(false);
  const [hover, setHover] = useState('');
  const [wrapRef, inView] = useInView();
  const scrollRef = useRef(null);

  // Kunin ang contributions ng nakaraang isang taon
  useEffect(() => {
    if (!username) return undefined;
    let cancelled = false;
    const cacheKey = `gh-contrib-${username}`;

    let cached = null;
    try {
      cached = JSON.parse(sessionStorage.getItem(cacheKey));
    } catch {
      /* ignore */
    }
    if (Array.isArray(cached) && cached.length > 0) setDays(cached);

    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then((res) => {
        if (!res.ok) throw new Error('bad response');
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        if (!Array.isArray(json.contributions) || json.contributions.length === 0) {
          throw new Error('no data');
        }
        setDays(json.contributions);
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(json.contributions));
        } catch {
          /* ignore */
        }
      })
      .catch(() => {
        if (!cancelled && !cached) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  const stats = useMemo(() => (days ? getStats(days) : null), [days]);
  const weeks = useMemo(() => (days ? getWeeks(days) : []), [days]);
  const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks]);

  const total = useCountUp(stats ? stats.total : 0, inView && Boolean(stats));
  const longest = useCountUp(stats ? stats.longest : 0, inView && Boolean(stats));
  const active = useCountUp(stats ? stats.active : 0, inView && Boolean(stats));

  // Ipakita agad ang pinakabago (kanan) sa maliit na screen
  useEffect(() => {
    if (days && scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
  }, [days]);

  if (!username) return null;

  return (
    <FadeUp className="card-github" index={index} id="github">
      <Reveal as="h2">
        <i className="fa-brands fa-github fa-2xs"></i> GitHub Contributions
      </Reveal>
      <Reveal as="p" delay={0.1} className="certs-subtitle">
        My coding activity over the past year on{' '}
        <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="gh-user">
          @{username}
        </a>
        .
      </Reveal>

      <Reveal delay={0.2}>
        <Card className="gh-card">
          {failed && (
            <div className="gh-empty">
              <i className="fa-brands fa-github"></i>
              <p>Couldn&apos;t load the contributions right now.</p>
              <a className="cert-btn" href={profileUrl} target="_blank" rel="noopener noreferrer">
                View my GitHub profile
              </a>
            </div>
          )}

          {!failed && !days && <div className="gh-skeleton" aria-label="Loading contributions"></div>}

          {days && stats && (
            <>
              <div className="gh-stats">
                <div className="gh-stat">
                  <span className="gh-stat-num">{total.toLocaleString()}</span>
                  <span className="gh-stat-label">Contributions</span>
                </div>
                <div className="gh-stat">
                  <span className="gh-stat-num">{longest.toLocaleString()}</span>
                  <span className="gh-stat-label">Longest streak (days)</span>
                </div>
                <div className="gh-stat">
                  <span className="gh-stat-num">{active.toLocaleString()}</span>
                  <span className="gh-stat-label">Active days</span>
                </div>
              </div>

              <div ref={wrapRef} className={`gh-wrap${inView ? ' in-view' : ''}`}>
                <div className="gh-days" aria-hidden="true">
                  <span></span>
                  <span>Mon</span>
                  <span></span>
                  <span>Wed</span>
                  <span></span>
                  <span>Fri</span>
                  <span></span>
                </div>

                <div ref={scrollRef} className="gh-scroll">
                  <div className="gh-months" aria-hidden="true">
                    {monthLabels.map((label) => (
                      <span key={`${label.name}-${label.w}`} style={{ '--w': label.w }}>
                        {label.name}
                      </span>
                    ))}
                  </div>

                  <div className="gh-grid" role="img" aria-label={`${stats.total} contributions in the last year`}>
                    {weeks.map((week, w) =>
                      week.map((day, d) =>
                        day ? (
                          <span
                            key={day.date}
                            className={`gh-cell lv${day.level}`}
                            style={{ '--c': w }}
                            onMouseEnter={() =>
                              setHover(
                                `${day.count} contribution${day.count === 1 ? '' : 's'} on ${formatDate(day.date)}`
                              )
                            }
                            onMouseLeave={() => setHover('')}
                          ></span>
                        ) : (
                          <span key={`empty-${w}-${d}`} className="gh-cell empty"></span>
                        )
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="gh-foot">
                <span className="gh-hover">
                  {hover || `${stats.total.toLocaleString()} contributions in the last year`}
                </span>
                <div className="gh-legend" aria-hidden="true">
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <span key={level} className={`gh-cell lv${level}`}></span>
                  ))}
                  <span>More</span>
                </div>
              </div>
            </>
          )}
        </Card>
      </Reveal>
    </FadeUp>
  );
}