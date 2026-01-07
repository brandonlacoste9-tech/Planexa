import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import publicRoutes from './routes/public';
import smsRoutes from './routes/sms';
import { quebecOnly } from './middleware/quebec-only';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ==========================================================================
// MIDDLEWARE
// ==========================================================================

// Trust proxy (required for Cloud Run to get real client IP)
app.set('trust proxy', true);

// CORS - Allow requests from Planexo frontend
app.use(cors({
  origin: [
    'https://planexo.ca',
    'https://www.planexo.ca',
    'https://storage.googleapis.com',
    'http://localhost:5173', // Development
  ],
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Twilio webhook format

// ==========================================================================
// QUÉBEC-ONLY GEOFENCING 🍁
// Restricts API access to users in Québec (Montréal, Québec City, etc.)
// ==========================================================================
app.use(quebecOnly);

// ==========================================================================
// ROUTES
// ==========================================================================

// Health check (bypasses geofencing)
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenue sur l\'API de Planexo v2.0 🍁 — Fait au Québec',
    status: 'online',
    region: 'Québec',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', region: 'northamerica-northeast1' });
});

// API Routes
app.use('/api', publicRoutes);
app.use('/api/sms', smsRoutes);

// ==========================================================================
// ERROR HANDLING
// ==========================================================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Page non trouvée',
    path: req.path,
  });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Erreur]:', err.message);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue. On s\'en occupe!',
  });
});

// ==========================================================================
// START SERVER
// ==========================================================================

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                    PLANEXO API v2.0 🍁                         ║
╠════════════════════════════════════════════════════════════════╣
║  Status:    En ligne                                           ║
║  Port:      ${port}                                               ║
║  Région:    Québec seulement                                   ║
║  Mode:      ${process.env.NODE_ENV || 'development'}                                     ║
╚════════════════════════════════════════════════════════════════╝
  `);
});
