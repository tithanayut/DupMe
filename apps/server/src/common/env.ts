import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || 'development';

export const PAYMENT_ENABLED = process.env.PAYMENT_ENABLED === 'true';
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
