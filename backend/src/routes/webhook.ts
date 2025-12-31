import { Router } from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();

router.post('/razorpay', async (req: any, res: any) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
        console.error("Webhook secret not configured");
        return res.status(500).json({ status: 'error', message: 'Configuration error' });
    }

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === req.headers['x-razorpay-signature']) {
        console.log('Webhook verified:', req.body.event);
        // Handle event (e.g., payment.captured)
        // const event = req.body;

        res.status(200).json({ status: 'ok' });
    } else {
        console.error('Invalid webhook signature');
        res.status(400).json({ status: 'error', message: 'Invalid signature' });
    }
});

export default router;
