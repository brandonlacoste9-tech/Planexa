import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = [
  'GOOGLE_API_KEY',
  'TWILIO_AUTH_TOKEN',
  'VERTEX_PROJECT_ID',
  'VERTEX_LOCATION'
] as const;

export const config = {
  googleApiKey: process.env.GOOGLE_API_KEY,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  vertexProjectId: process.env.VERTEX_PROJECT_ID,
  vertexLocation: process.env.VERTEX_LOCATION,
  port: process.env.PORT || 3000,
};

// Fail fast
// We throw if any required variable is missing to ensure the app doesn't start in a broken state
export function validateEnv() {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
