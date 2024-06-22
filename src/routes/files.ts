import { Router } from 'express';

import { getFiles } from '../controllers/files';
import { cacheMiddleware } from '../middleware/cache';

const router = Router();

router.get('/', cacheMiddleware, getFiles);

export default router;