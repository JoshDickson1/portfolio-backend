"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterRouter = void 0;
const express_1 = require("express");
const nodemailer_1 = __importDefault(require("nodemailer"));
const supabase_1 = require("../config/supabase");
const env_1 = require("../config/env");
exports.newsletterRouter = (0, express_1.Router)();
exports.newsletterRouter.post('/', async (req, res) => {
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
    const { error: dbError } = await supabase_1.supabase
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
            await transporter.sendMail({
                from: `"Portfolio" <${env_1.env.SMTP_USER}>`,
                to: env_1.env.NOTIFY_EMAIL,
                subject: `New newsletter subscriber: ${email.trim()}`,
                html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="margin-bottom:16px">New newsletter subscriber</h2>
            <p style="color:#111"><strong>${email.trim()}</strong> subscribed via the footer on your portfolio.</p>
          </div>`,
            });
        }
        catch (emailErr) {
            console.error('[newsletter] email send failed (non-fatal):', emailErr);
        }
    }
    res.json({ success: true });
});
//# sourceMappingURL=newsletter.js.map