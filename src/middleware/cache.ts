import { Request, Response, NextFunction } from "express";

import Cache from "node-cache";

const cache = new Cache({ stdTTL: 60 * 60 * 5 });

const cacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (cache.has("files")) {
            return res.send(cache.get("files")).status(200);
        }
        return next();
    } catch (err) {
        throw err;
    }
};

export {
    cacheMiddleware,
    cache
};