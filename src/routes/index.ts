import { Router } from 'express';
import { contactRouter } from './contact';
import { newsletterRouter } from './newsletter';

export const router = Router();

// Health sub-check
router.get('/', (_, res) => res.json({ version: 'v1', status: 'ok' }));

router.use('/contact', contactRouter);
router.use('/newsletter', newsletterRouter);

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
