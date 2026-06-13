import { Router, Request, Response } from 'express';
import { env } from '../config/env';

export const githubRouter = Router();

const GH_GRAPHQL = 'https://api.github.com/graphql';
const USERNAME   = 'JoshDickson1';

const QUERY = `
  query($from: DateTime!, $to: DateTime!) {
    user(login: "${USERNAME}") {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              weekday
            }
          }
        }
      }
    }
  }
`;

githubRouter.get('/contributions', async (req: Request, res: Response) => {
  const year = parseInt(req.query.year as string) || new Date().getFullYear();

  const from = new Date(`${year}-01-01T00:00:00Z`).toISOString();
  const to   = new Date(`${year}-12-31T23:59:59Z`).toISOString();

  if (!env.GITHUB_PAT) {
    return res.status(503).json({ error: 'GitHub PAT not configured' });
  }

  try {
    const ghRes = await fetch(GH_GRAPHQL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.GITHUB_PAT}`,
        'Content-Type':  'application/json',
        'User-Agent':    'joshuadickson-portfolio',
      },
      body: JSON.stringify({ query: QUERY, variables: { from, to } }),
    });

    if (!ghRes.ok) {
      return res.status(502).json({ error: 'GitHub API error', status: ghRes.status });
    }

    const json = await ghRes.json() as {
      data?: { user?: { contributionsCollection?: { contributionCalendar?: unknown } } };
      errors?: unknown;
    };

    if (json.errors) {
      return res.status(502).json({ error: 'GitHub GraphQL error', details: json.errors });
    }

    const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
    return res.json(calendar ?? {});
  } catch (err) {
    return res.status(500).json({ error: 'Internal error' });
  }
});
