import { Router } from 'express';
import { Stripe } from 'stripe';

import { STRIPE_SECRET_KEY } from './common/env';
import { RoomService } from './services/gameroom.service';
import { ScoreService } from './services/score.service';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const paymentRoute = Router();

paymentRoute.get('/', async (req, res) => {
  const socketId = req.query.socketId as string;
  if (!socketId) return res.status(400).send('Missing socketId');

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: 'price_1O2FXwFKTpiSPLbiaU6RB9Mv',
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer_email: 'dupme@thanayut.in.th',
    metadata: {
      socketId,
    },
    success_url: `http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: 'http://localhost:3000/payment/cancel',
  });

  res.redirect(303, session.url!);
});

paymentRoute.get('/success', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id as string);
  if (session.payment_status !== 'paid') return res.status(400).send('Payment not completed');

  const socketId = session.metadata?.socketId;
  if (socketId) {
    ScoreService.increaseScore(RoomService.getPlayerRoom(socketId).name, socketId, 100000);
  }
  res.send('<script>window.close()</script>');
});

paymentRoute.get('/cancel', (_, res) => {
  res.send('<script>window.close()</script>');
});
