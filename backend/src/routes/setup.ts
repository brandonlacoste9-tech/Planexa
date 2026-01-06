import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// Validation Schemas
const AiKeySchema = z.object({
  key: z.string().min(10),
  provider: z.enum(['google', 'openai', 'deepseek'])
});

const EmailTestSchema = z.object({
  email: z.string().email(),
  provider: z.enum(['smtp', 'gmail', 'outlook']).optional()
});

const PhoneSchema = z.object({
  phoneNumber: z.string().min(10)
});

// POST /api/setup/validate-ai-key
router.post('/validate-ai-key', async (req, res) => {
  try {
    const { key, provider } = AiKeySchema.parse(req.body);
    
    // Mock Validation Logic
    const isValid = key.length > 20; // Simple length check for mock
    
    if (isValid) {
      return res.json({ 
        valid: true, 
        message: `Successfully connected to ${provider}` 
      });
    } else {
      return res.status(400).json({ 
        valid: false, 
        error: 'Invalid API Key format' 
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/setup/test-email
router.post('/test-email', async (req, res) => {
  try {
    const { email } = EmailTestSchema.parse(req.body);
    
    // Mock Email Sending
    console.log(`[Mock] Sending test email to ${email}`);
    
    return res.json({ 
      success: true, 
      message: 'Test email sent successfully' 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: 'Failed to send test email' });
  }
});

// POST /api/setup/oauth/:provider
router.post('/oauth/:provider', async (req, res) => {
    const { provider } = req.params;
    
    if (!['google', 'outlook'].includes(provider)) {
        return res.status(400).json({ error: 'Invalid provider' });
    }

    // Mock OAuth URL generation
    const mockAuthUrl = `https://accounts.${provider}.com/o/oauth2/auth?response_type=code&client_id=mock_client_id&redirect_uri=http://localhost:3000/callback`;
    
    return res.json({ url: mockAuthUrl });
});

// POST /api/setup/test-call
router.post('/test-call', async (req, res) => {
  try {
    const { phoneNumber } = PhoneSchema.parse(req.body);
    
    // Mock Call
    console.log(`[Mock] Initiating test call to ${phoneNumber}`);
    
    return res.json({ 
      success: true, 
      callSid: 'CA' + Math.random().toString(36).substring(7) 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: 'Failed to initiate call' });
  }
});

// POST /api/setup/test-calendar
router.post('/test-calendar', async (req, res) => {
    // Mock Calendar Check
    return res.json({ 
        success: true, 
        calendars: [
            { id: 'primary', name: 'Primary Calendar' },
            { id: 'work', name: 'Work' }
        ] 
    });
});

export default router;
