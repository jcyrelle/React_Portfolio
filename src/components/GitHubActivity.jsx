import { useEffect, useMemo, useRef, useState } from 'react';
import Card from './Card.jsx';
import FadeUp from './FadeUp.jsx';
import Reveal from './Reveal.jsx';
import useInView from '../hooks/useInView.js';
import { githubActivity } from '../data/portfolio.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_MS = 86400000;
const CELL = 12; // laki ng bawat kahon (px), dapat tugma sa --cell sa CSS
const GAP = 3; // pagitan ng mga kahon (px), dapat tugma sa --gap sa CSS
const MAX_YEARS = 5; // ilang taon ang ipapakita sa gilid

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
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
    const duration = 900;
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

// Buong taon (Jan 1 - Dec 31), hinati sa mga linggo. Linggo ang simula ng bawat hanay.
function buildYear(year, byDate) {
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year, 11, 31);
  const cells = Array(new Date(start).getUTCDay()).fill(null);

  for (let t = start; t <= end; t += DAY_MS) {
    const date = new Date(t).toISOString().slice(0, 10);
    const found = byDate.get(date);
    cells.push({ date, count: found ? found.count : 0, level: found ? found.level : 0 });
  }

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

  if (labels.length > 1 && labels[1].w - labels[0].w < 3) labels.shift();
  return labels;
}

export default function GitHubActivity({ index }) {
  const username = githubActivity.username;
  const profileUrl = `https://github.com/${username}`;

  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState(null);
  const [hover, setHover] = useState('');
  const [wrapRef, inView] = useInView();
  const scrollRef = useRef(null);

  // Kunin ang contributions ng lahat ng taon
  useEffect(() => {
    if (!username) return undefined;
    let cancelled = false;
    const cacheKey = `gh-contrib-all-${username}`;

    let cached = null;
    try {
      cached = JSON.parse(sessionStorage.getItem(cacheKey));
    } catch {
      /* ignore */
    }
    if (Array.isArray(cached) && cached.length > 0) setData(cached);

    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=all`)
      .then((res) => {
        if (!res.ok) throw new Error('bad response');
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        if (!Array.isArray(json.contributions) || json.contributions.length === 0) {
          throw new Error('no data');
        }
        setData(json.contributions);
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(json.contributions));
        } catch {
          /* ignore quota errors */
        }
      })
      .catch(() => {
        if (!cancelled && !cached) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  const byDate = useMemo(() => {
    const map = new Map();
    (data || []).forEach((day) => map.set(day.date, day));
    return map;
  }, [data]);

  // Kabuuang contributions bawat taon
  const totals = useMemo(() => {
    const result = {};
    (data || []).forEach((day) => {
      const y = day.date.slice(0, 4);
      result[y] = (result[y] || 0) + day.count;
    });
    return result;
  }, [data]);

  // Mga taon na ipapakita sa gilid (pinakabago ang nasa itaas)
  const years = useMemo(() => {
    const current = String(new Date().getFullYear());
    const list = Object.keys(totals).filter((y) => totals[y] > 0 || y === current);
    if (!list.includes(current)) list.push(current);
    return list.sort((a, b) => Number(b) - Number(a)).slice(0, MAX_YEARS).map(Number);
  }, [totals]);

  const activeYear = selected ?? years[0];
  const weeks = useMemo(
    () => (activeYear ? buildYear(activeYear, byDate) : []),
    [activeYear, byDate]
  );
  const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks]);
  const today = new Date().toISOString().slice(0, 10);

  const status = failed
    ? "Couldn't load the contributions right now."
    : !data
    ? 'Loading contributions...'
    : '';
  const yearTotal = totals[String(activeYear)] || 0;
  const shownTotal = useCountUp(yearTotal, inView && Boolean(data));

  // Sa kasalukuyang taon, ipakita ang pinakabagong linggo sa maliit na screen
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (activeYear === new Date().getFullYear()) {
      const pad = new Date(Date.UTC(activeYear, 0, 1)).getUTCDay();
      const dayOfYear = Math.floor((Date.now() - Date.UTC(activeYear, 0, 1)) / DAY_MS);
      const column = Math.floor((pad + dayOfYear) / 7);
      el.scrollLeft = Math.max(0, (column + 1) * (CELL + GAP) - el.clientWidth + 24);
    } else {
      el.scrollLeft = 0;
    }
  }, [data, activeYear]);

  if (!username) return null;

  return (
    <FadeUp className="card-github" index={index} id="github">
      <Reveal as="h2">
        <i className="fa-brands fa-github fa-2xs"></i> GitHub Contributions
      </Reveal>

      <Reveal delay={0.15}>
        <Card className="gh-card">
          <div className="gh-head">
            <a className="gh-profile" href={profileUrl} target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-github"></i>
              <span>{username}</span>
            </a>
            <a
              className="gh-open"
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open GitHub profile"
            >
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>

          <div className="gh-body">
            <div className="gh-main">
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

                  {/* key={activeYear}: pag nagpalit ng taon, ulit ang pop-in animation */}
                  <div
                    key={activeYear}
                    className="gh-grid"
                    role="img"
                    aria-label={`${yearTotal} contributions in ${activeYear}`}
                  >
                    {weeks.map((week, w) =>
                      week.map((day, d) =>
                        day ? (
                          <span
                            key={day.date}
                            className={`gh-cell lv${day.level}${day.date > today ? ' future' : ''}`}
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
                  {hover || status || `${shownTotal.toLocaleString()} contributions in ${activeYear}`}
                </span>
                <div className="gh-legend" aria-hidden="true">
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <span key={level} className={`gh-cell lv${level}`}></span>
                  ))}
                  <span>More</span>
                </div>
              </div>
            </div>

            <div className="gh-years">
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  className={`gh-year${year === activeYear ? ' active' : ''}`}
                  aria-pressed={year === activeYear}
                  onClick={() => setSelected(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </Reveal>
    </FadeUp>
  );
}