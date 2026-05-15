import type { Request, Response } from 'express';

export function notFound(req: Request, res: Response) {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
}
