import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

export const verifyRecaptcha = async (token: string): Promise<boolean> => {
    if (!token) return false;

    // Bypass for development if no secret key set
    if (!RECAPTCHA_SECRET_KEY || RECAPTCHA_SECRET_KEY === 'your_secret_key') {
        console.warn('Recaptcha secret missing, bypassing verification (Dev Mode)');
        return true;
    }

    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
        );
        return response.data.success && response.data.score >= 0.5; // Threshold 0.5
    } catch (error) {
        console.error('Recaptcha verification error:', error);
        return false;
    }
};
