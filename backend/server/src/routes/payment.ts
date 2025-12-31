import { Router } from 'express';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { supabase } from '../db/supabase';
import { generalLimiter } from '../middleware/rateLimit';

dotenv.config();

const router = Router();
router.use(generalLimiter); // Apply to all payment routes

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

router.post('/create-order', async (req, res) => {
    const { amount, creatorId } = req.body;
    try {
        const options = {
            amount: amount * 100, // amount in smallest currency unit
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);

        // Save initial payment record
        // Note: ensuring we store razorpay_order_id for verification
        const { error } = await supabase.from('payments').insert([
            {
                amount,
                creator_id: creatorId,
                razorpay_order_id: order.id,
                status: 'pending'
            }
        ]);

        if (error) {
            console.error("Supabase Error:", error);
            throw error;
        }

        res.json(order);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/verify', async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'secret';
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === req.headers['x-razorpay-signature']) {
        const event = req.body;
        if (event.event === 'payment.captured') {
            const { order_id, id: payment_id } = event.payload.payment.entity;

            // 1. Update Payment Status
            const { data: payment } = await supabase
                .from('payments')
                .update({ status: 'paid', razorpay_payment_id: payment_id })
                .eq('razorpay_order_id', order_id)
                .select()
                .single();

            // 2. Update Creator Earnings
            if (payment) {
                const { data: creator } = await supabase
                    .from('creators')
                    .select('total_earnings')
                    .eq('id', payment.creator_id)
                    .single();

                if (creator) {
                    const newTotal = (Number(creator.total_earnings) || 0) + Number(payment.amount);
                    await supabase
                        .from('creators')
                        .update({ total_earnings: newTotal })
                        .eq('id', payment.creator_id);
                }
            }
        }
        res.json({ status: 'ok' });
    } else {
        res.status(400).json({ status: 'invalid_signature' });
    }
});

export default router;
