// ============================================================================
// PLANEXO - Québec-Only Geofencing Middleware ⚜️
// Restricts access to users from Québec (Montréal, Québec City, and region)
// Montréal-pinned • Region-sovereign • Crafted for Québec
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import geoip from 'geoip-lite';

// Allowed cities (lowercase, with accents and without)
const ALLOWED_CITIES = [
  'montreal', 'montréal',
  'quebec', 'québec', 'quebec city',
  'laval', 'longueuil', 'gatineau',
  'sherbrooke', 'saguenay',
  'lévis', 'levis',
  'trois-rivières', 'trois-rivieres',
  'terrebonne', 'saint-jean-sur-richelieu',
  'repentigny', 'brossard',
  'drummondville', 'saint-jérôme', 'granby',
  'rimouski', 'chicoutimi', 'saint-hyacinthe',
];

// Allowed region codes
const ALLOWED_REGIONS = ['qc'];

// Allowed country
const ALLOWED_COUNTRY = 'CA';

// Internal bypass header (for admin tools)
const INTERNAL_BYPASS_HEADER = 'x-planexo-internal';
const INTERNAL_BYPASS_SECRET = process.env.INTERNAL_BYPASS_SECRET || 'planexo-internal-2026';

interface GeoLookup {
  country?: string;
  region?: string;
  city?: string;
  ll?: [number, number];
}

/**
 * Extracts the real client IP from various headers
 */
function getClientIP(req: Request): string {
  // Cloud Run / Load Balancer
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    const ips = Array.isArray(xForwardedFor) 
      ? xForwardedFor[0] 
      : xForwardedFor.split(',')[0];
    return ips.trim();
  }

  // Cloud Run specific
  const xRealIP = req.headers['x-real-ip'];
  if (xRealIP) {
    return Array.isArray(xRealIP) ? xRealIP[0] : xRealIP;
  }

  // Fallback
  return req.ip || req.socket.remoteAddress || '';
}

/**
 * Checks if the request is from Québec
 */
function isFromQuebec(geo: GeoLookup | null): boolean {
  if (!geo) return false;

  // Must be from Canada
  if (geo.country !== ALLOWED_COUNTRY) return false;

  // Check region (QC)
  const region = geo.region?.toLowerCase() || '';
  if (ALLOWED_REGIONS.includes(region)) return true;

  // Check specific cities
  const city = geo.city?.toLowerCase() || '';
  if (ALLOWED_CITIES.some(allowed => city.includes(allowed))) return true;

  return false;
}

/**
 * Formats location for logging
 */
function formatLocation(geo: GeoLookup | null): string {
  if (!geo) return 'Unknown';
  return `${geo.city || 'Unknown'} (${geo.region || '??'}, ${geo.country || '??'})`;
}

/**
 * Check if request is from a browser (vs API client)
 */
function isBrowserRequest(req: Request): boolean {
  const accept = req.headers.accept || '';
  return accept.includes('text/html');
}

/**
 * Québec-Only Middleware ⚜️
 * Blocks requests from outside Québec with premium handling
 */
export function quebecOnly(req: Request, res: Response, next: NextFunction): void | Response {
  // Skip geofencing for health checks and internal routes
  const bypassPaths = ['/', '/health', '/api/health', '/_ah/health', '/favicon.ico'];
  if (bypassPaths.includes(req.path)) {
    return next();
  }

  // Check for internal bypass header (admin tools)
  const bypassHeader = req.headers[INTERNAL_BYPASS_HEADER];
  if (bypassHeader === INTERNAL_BYPASS_SECRET) {
    console.log(`[QC-GEOFENCE] ⚜️ Bypass: Internal tool access`);
    return next();
  }

  // Get client IP
  const ip = getClientIP(req);

  // Skip for localhost/development
  const localIPs = ['127.0.0.1', '::1', '::ffff:127.0.0.1', 'localhost'];
  if (localIPs.includes(ip) || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    console.log(`[QC-GEOFENCE] ⚜️ Allowed: Development (${ip})`);
    return next();
  }

  // Lookup geo data
  const geo = geoip.lookup(ip) as GeoLookup | null;
  const location = formatLocation(geo);

  // Check if from Québec
  if (isFromQuebec(geo)) {
    console.log(`[QC-GEOFENCE] ⚜️ Allowed: ${location}`);
    // Attach geo info to request for potential use
    (req as any).geoLocation = geo;
    (req as any).isFromQuebec = true;
    return next();
  }

  // Log the block
  console.log(`[QC-GEOFENCE] 🚫 Blocked: ${location} → ${req.path}`);

  // For browser requests, redirect to Québec-only page
  if (isBrowserRequest(req)) {
    return res.status(403).send(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Planexo - Québec seulement</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f0f4ff 0%, #ffffff 50%, #f0f4ff 100%);
            color: #1e293b;
            text-align: center;
            padding: 2rem;
          }
          .container { max-width: 480px; }
          .fleur { font-size: 4rem; margin-bottom: 1.5rem; animation: pulse 2s infinite; }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.9; }
          }
          h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; }
          p { color: #64748b; line-height: 1.6; margin-bottom: 1.5rem; }
          .badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: #eff6ff;
            color: #2563eb;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
          }
          .footer { margin-top: 3rem; color: #94a3b8; font-size: 0.875rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="fleur">⚜️</div>
          <h1>Planexo, c'est pour le Québec</h1>
          <p>Notre plateforme est présentement disponible seulement pour les gens du Québec. C'est comme ça qu'on bâtit quelque chose de local, pour notre monde à nous.</p>
          <span class="badge">🍁 Montréal • Québec • Laval • Gatineau</span>
          <div class="footer">
            <p>Des questions? <a href="mailto:bonjour@planexo.ca" style="color: #2563eb;">bonjour@planexo.ca</a></p>
            <p style="margin-top: 1rem;">⚜️ Planexo — Fait au Québec</p>
          </div>
        </div>
      </body>
      </html>
    `);
  }

  // For API requests, return JSON
  return res.status(403).json({
    error: 'Accès réservé au Québec',
    code: 'QC_ONLY',
    message: 'Planexo est présentement disponible seulement au Québec. Merci de ta compréhension!',
    detected: {
      country: geo?.country || 'unknown',
      region: geo?.region || 'unknown',
      city: geo?.city || 'unknown',
    },
    allowed: ['QC'],
    support: 'bonjour@planexo.ca',
  });
}

/**
 * Soft geofencing (logs but doesn't block)
 * Useful for gradual rollout or analytics
 */
export function quebecOnlySoft(req: Request, res: Response, next: NextFunction): void {
  const ip = getClientIP(req);
  const geo = geoip.lookup(ip) as GeoLookup | null;
  const location = formatLocation(geo);
  const isQC = isFromQuebec(geo);

  if (isQC) {
    console.log(`[QC-GEOFENCE] ⚜️ Visitor: ${location}`);
  } else {
    console.warn(`[QC-GEOFENCE] 👀 Outside QC: ${location} → ${req.path}`);
  }

  (req as any).geoLocation = geo;
  (req as any).isFromQuebec = isQC;
  
  next();
}

export default quebecOnly;
