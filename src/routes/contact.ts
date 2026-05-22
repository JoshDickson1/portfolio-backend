import { Router, Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { supabase } from '../config/supabase';
import { env } from '../config/env';

export const contactRouter = Router();

interface ContactBody {
  name: string;
  email: string;
  company?: string;
  link?: string;
  idea: string;
  budget?: string;
  timeline?: string;
  source?: string;
}

contactRouter.post('/', async (req: Request<object, object, ContactBody>, res: Response) => {
  const { name, email, company = '', link = '', idea, budget = '', timeline = '', source = '' } = req.body;

  if (!name?.trim() || !email?.trim() || !idea?.trim()) {
    res.status(400).json({ error: 'name, email, and idea are required' });
    return;
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    res.status(400).json({ error: 'invalid email address' });
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: dbError } = await (supabase as any)
    .from('contact_submissions')
    .insert({ name: name.trim(), email: email.trim(), company, link, idea: idea.trim(), budget, timeline, source });

  if (dbError) {
    console.error('[contact] db insert error:', dbError);
    res.status(500).json({ error: 'failed to save submission' });
    return;
  }

  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && env.NOTIFY_EMAIL) {
    try {
      const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        requireTLS: env.SMTP_PORT === 587,
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
        tls: { rejectUnauthorized: false },
      });

      const row = (label: string, value: string) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#6b7280;white-space:nowrap">${label}</td><td style="padding:6px 12px;color:#111">${value || '—'}</td></tr>`;

      await transporter.sendMail({
        from: `"Portfolio Contact" <${env.SMTP_USER}>`,
        to: env.NOTIFY_EMAIL,
        subject: `New collab request from ${name.trim()}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="margin-bottom:24px">New collab request</h2>
            <table style="border-collapse:collapse;width:100%;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
              <tbody>
                ${row('From', `${name.trim()} &lt;${email.trim()}&gt;`)}
                ${company ? row('Company / Role', company) : ''}
                ${link ? row('Link', `<a href="${link}">${link}</a>`) : ''}
                ${row('Idea', idea.trim().replace(/\n/g, '<br>'))}
                ${row('Budget', budget)}
                ${row('Timeline', timeline)}
                ${row('Found via', source)}
              </tbody>
            </table>
          </div>`,
      });
    } catch (emailErr) {
      console.error('[contact] email send failed (non-fatal):', emailErr);
    }
  }

  res.json({ success: true });
});
