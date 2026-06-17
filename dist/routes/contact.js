"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactRouter = void 0;
const express_1 = require("express");
const nodemailer_1 = __importDefault(require("nodemailer"));
const supabase_1 = require("../config/supabase");
const env_1 = require("../config/env");
exports.contactRouter = (0, express_1.Router)();
exports.contactRouter.post('/', async (req, res) => {
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
    const { error: dbError } = await supabase_1.supabase
        .from('contact_submissions')
        .insert({ name: name.trim(), email: email.trim(), company, link, idea: idea.trim(), budget, timeline, source });
    if (dbError) {
        console.error('[contact] db insert error:', dbError);
        res.status(500).json({ error: 'failed to save submission' });
        return;
    }
    if (env_1.env.SMTP_HOST && env_1.env.SMTP_USER && env_1.env.SMTP_PASS && env_1.env.NOTIFY_EMAIL) {
        try {
            const transporter = nodemailer_1.default.createTransport({
                host: env_1.env.SMTP_HOST,
                port: env_1.env.SMTP_PORT,
                secure: env_1.env.SMTP_PORT === 465,
                requireTLS: env_1.env.SMTP_PORT === 587,
                auth: { user: env_1.env.SMTP_USER, pass: env_1.env.SMTP_PASS },
                tls: { rejectUnauthorized: false },
            });
            const row = (label, value) => `<tr><td style="padding:6px 12px;font-weight:600;color:#6b7280;white-space:nowrap">${label}</td><td style="padding:6px 12px;color:#111">${value || '—'}</td></tr>`;
            await transporter.sendMail({
                from: `"Portfolio Contact" <${env_1.env.SMTP_USER}>`,
                to: env_1.env.NOTIFY_EMAIL,
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
        }
        catch (emailErr) {
            console.error('[contact] email send failed (non-fatal):', emailErr);
        }
    }
    res.json({ success: true });
});
//# sourceMappingURL=contact.js.map