import { Router } from 'express';
import { supabase } from '../db/supabase';

const router = Router();

// Get public profile
router.get('/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const { data: user } = await supabase
            .from('users')
            .select('id, username')
            .eq('username', username)
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

export default router;
