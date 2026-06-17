"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const contact_1 = require("./contact");
const newsletter_1 = require("./newsletter");
const github_1 = require("./github");
exports.router = (0, express_1.Router)();
// Health sub-check
exports.router.get('/', (_, res) => res.json({ version: 'v1', status: 'ok' }));
exports.router.use('/contact', contact_1.contactRouter);
exports.router.use('/newsletter', newsletter_1.newsletterRouter);
exports.router.use('/github', github_1.githubRouter);
// Resource routes will be mounted here during implementation phase
// router.use('/auth',           authRoutes);
// router.use('/projects',       projectRoutes);
// router.use('/blog',           blogRoutes);
// router.use('/gallery',        galleryRoutes);
// router.use('/events',         eventRoutes);
// router.use('/skills',         skillRoutes);
// router.use('/testimonials',   testimonialRoutes);
// router.use('/certifications', certificationRoutes);
// router.use('/upload',         uploadRoutes);
//# sourceMappingURL=index.js.map