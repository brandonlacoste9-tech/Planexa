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
  vertexProjectId: process.env.VERTEX_PROJECT_ID || 'unique-spirit-482300-s4', // Fallback for now to avoid breaking if env not set immediately, but warnings should be logged
  vertexLocation: process.env.VERTEX_LOCATION || 'us-central1',
  port: process.env.PORT || 3000,
};

// Fail fast
const missingVars = requiredEnvVars.filter(key => !process.env[key]);

// For the purpose of this task, we will just log a huge warning instead of crashing 
// if we are in a dev/demo environment where the user hasn't set them up yet,
// BUT the prompt asks to "fail fast". So I will throw an error.
// However, since I cannot set env vars in the system easily (I can only write files),
// I will write a check that throws if they are missing.

export function validateEnv() {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
