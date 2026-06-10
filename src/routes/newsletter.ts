import { Router, Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { supabase } from '../config/supabase';
import { env } from '../config/env';

export const newsletterRouter = Router();

newsletterRouter.post('/', async (req: Request<object, object, { email: string }>, res: Response) => {
  const { email } = req.body;

  if (!email?.trim()) {
    res.status(400).json({ error: 'email is required' });
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
    .insert({
      name: email.trim(),
      email: email.trim(),
      idea: 'Newsletter subscription',
      source: 'newsletter',
    });

  if (dbError) {
    console.error('[newsletter] db insert error:', dbError);
    res.status(500).json({ error: 'failed to save subscription' });
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

      await transporter.sendMail({
        from: `"Portfolio" <${env.SMTP_USER}>`,
        to: env.NOTIFY_EMAIL,
        subject: `New newsletter subscriber: ${email.trim()}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="margin-bottom:16px">New newsletter subscriber</h2>
            <p style="color:#111"><strong>${email.trim()}</strong> subscribed via the footer on your portfolio.</p>
          </div>`,
      });
    } catch (emailErr) {
      console.error('[newsletter] email send failed (non-fatal):', emailErr);
    }
  }

  res.json({ success: true });
});
