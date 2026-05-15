import ImageKit from 'imagekit';
import { env } from './env';

export const imagekit = new ImageKit({
  publicKey:   env.IMAGEKIT_PUBLIC_KEY,
  privateKey:  env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
});

export const IK_FOLDERS = {
  projects:       '/projects',
  blog:           '/blog',
  gallery:        '/gallery',
  events:         '/events',
  certifications: '/certifications',
  avatars:        '/avatars',
} as const;
