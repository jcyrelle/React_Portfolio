// Vercel serverless function: kinukuha ang GitHub contributions gamit ang opisyal na GitHub API.
// Nasa Vercel Environment Variables ang token (GITHUB_TOKEN), hindi ito nakasulat sa code.

const LEVELS = {
  NONE: 0,
  FIRST_QUARTER: 1,
  SECOND_QUARTER: 2,
  THIRD_QUARTER: 3,
  FOURTH_QUARTER: 4,
};

export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME || 'jcyrelle';

  if (!token) {
    res.status(500).json({ error: 'Missing GITHUB_TOKEN' });
    return;
  }

  const query = `
    query ($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'portfolio-contributions',
      },
      body: JSON.stringify({ query, variables: { login: username } }),
    });

    const json = await response.json();
    const weeks = json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks;

    if (!response.ok || !Array.isArray(weeks)) {
      res.status(502).json({ error: 'GitHub request failed' });
      return;
    }

    const contributions = weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: LEVELS[day.contributionLevel] ?? 0,
      }))
    );

    // I-cache ng 1 oras para hindi paulit-ulit ang tawag sa GitHub
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json({ contributions });
  } catch {
    res.status(502).json({ error: 'Something went wrong' });
  }
}