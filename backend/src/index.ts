import express from 'express';
import cors from 'cors';
import { config, validateEnv } from './config';
import publicRoutes from './routes/public';
import smsRoutes from './routes/sms';

// Validate environment variables early
try {
  validateEnv();
} catch (error: any) {
  console.error('❌ Configuration Error:', error.message);
  process.exit(1);
}

const app = express();
const port = config.port;

app.use(cors());
app.use(express.json());
// Twilio sends data as application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use('/api', publicRoutes);
app.use('/api/sms', smsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API de Planexa v2.0' });
});

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`[serveur]: Le serveur roule à http://0.0.0.0:${port}`);
});
