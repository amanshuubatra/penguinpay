import { Router } from 'express';
import crypto from 'crypto';
import { supabase } from '../db/supabase';
import { generalLimiter } from '../middleware/rateLimit';
import razorpay from '../services/razorpay';
import { recaptchaMiddleware } from '../middleware/recaptcha';

const router = Router();
router.use(generalLimiter);

const isMockMode = process.env.RAZORPAY_KEY_ID === 'rzp_test_placeholder' || !process.env.RAZORPAY_KEY_ID;

router.post('/create-order', recaptchaMiddleware, async (req: any, res: any) => {
    const { amount, creatorId, message, senderName } = req.body;

    if (isMockMode) {
        console.log('🐧 Mock Mode: Creating dummy order');
        return res.json({
            id: `order_mock_${Date.now()}`,
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_mock_${Date.now()}`,
            status: 'created'
        });
    }

    try {
        const options = {
            amount: amount * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                creatorId,
                message: message || '',
                senderName: senderName || 'Anonymous'
            }
        };

        const order = await razorpay.orders.create(options);

        // Save pending transaction
        const { error } = await supabase
            .from('payments')
            .insert([
                {
                    amount: amount,
                    currency: 'INR',
                    status: 'pending',
                    razorpay_order_id: order.id,
                    creator_id: creatorId,
                    message: message,
                    sender_name: senderName
                }
            ]);

        if (error) {
            console.error('Db Insert Error', error);
            throw error;
        }

        res.json(order);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/verify-payment', async (req, res) => {
    if (isMockMode) {
        console.log('🐧 Mock Mode: Verifying dummy payment');
        return res.json({ message: "Payment verified successfully (Mock)" });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        // Update payment status
        await supabase
            .from('payments')
            .update({ status: 'success', razorpay_payment_id: razorpay_payment_id })
            .eq('razorpay_order_id', razorpay_order_id);

        // TODO: Update creator's total earnings (transaction/trigger ideally)

        res.json({ message: "Payment verified successfully" });
    } else {
        res.status(400).json({ error: "Invalid signature" });
    }
});

export default router;
