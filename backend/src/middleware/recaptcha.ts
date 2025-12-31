import { Request, Response, NextFunction } from 'express';
import { verifyRecaptcha } from '../utils/recaptcha';

export const recaptchaMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.recaptchaToken;

    if (!token) {
        return res.status(400).json({ error: 'Recaptcha token is required' });
    }

    const isHuman = await verifyRecaptcha(token);
    if (!isHuman) {
        return res.status(400).json({ error: 'Recaptcha verification failed' });
    }

    next();
};
