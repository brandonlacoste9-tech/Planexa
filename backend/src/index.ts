import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import publicRoutes from './routes/public';
import smsRoutes from './routes/sms';
import setupRoutes from './routes/setup';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Twilio sends data as application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use('/api', publicRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/setup', setupRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API de Planexa v2.0' });
});

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`[serveur]: Le serveur roule à http://0.0.0.0:${port}`);
});
