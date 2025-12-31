import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../db/supabase';
import { authLimiter } from '../middleware/rateLimit';
import { validate } from '../middleware/validate';
import { signupSchema, loginSchema } from '../schemas/auth';
import { verifyRecaptcha } from '../utils/recaptcha';

const router = Router();

// ... authenticateToken middleware ... (keep existing)
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

router.get('/me', authenticateToken, async (req: any, res: any) => {
    try {
        const { data: user } = await supabase
            .from('users')
            .select('id, email, username, role')
            .eq('id', req.user.userId)
            .single();

        if (!user) return res.status(404).json({ error: 'User not found' });

        const { data: creator } = await supabase
            .from('creators')
            .select('*')
            .eq('user_id', user.id)
            .single();

        res.json({ ...user, creator });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/signup', authLimiter, validate(signupSchema), async (req: any, res: any) => {
    const { email, password, username, displayName, recaptchaToken } = req.body;

    // Mock Mode Check
    if (process.env.SUPABASE_URL === 'test_supabase_url') {
        return res.status(201).json({
            message: 'User created successfully (Mock)',
            user: { id: 'mock_user_id', email },
            token: 'mock_jwt_token'
        });
    }

    try {
        // Verify Recaptcha
        const isHuman = await verifyRecaptcha(recaptchaToken);
        if (!isHuman) return res.status(400).json({ error: 'Recaptcha verification failed' });

        // 1. Check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create user
        const { data, error } = await supabase
            .from('users')
            .insert([{ email, password_hash: hashedPassword, username }])
            .select()
            .single();

        if (error) throw error;

        // 4. Create profile
        await supabase.from('creators').insert([{
            user_id: data.id,
            display_name: displayName,
            total_earnings: 0
        }]);

        res.status(201).json({ message: 'User created successfully', user: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', authLimiter, validate(loginSchema), async (req: any, res: any) => {
    const { email, password, recaptchaToken } = req.body;

    // Mock Mode Check
    if (process.env.SUPABASE_URL === 'test_supabase_url') {
        return res.json({
            message: 'Login successful (Mock)',
            token: 'mock_jwt_token',
            user: { email }
        });
    }

    try {
        // Verify Recaptcha
        const isHuman = await verifyRecaptcha(recaptchaToken);
        if (!isHuman) return res.status(400).json({ error: 'Recaptcha verification failed' });

        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token, user });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
