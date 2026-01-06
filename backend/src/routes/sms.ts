import { Router } from 'express';
import { VertexAI } from '@google-cloud/vertexai';
import prisma from '../lib/prisma';
import twilio from 'twilio';
import { config } from '../config';

const router = Router();

// Configuration for Vertex AI
const PROJECT_ID = config.vertexProjectId;
const LOCATION = config.vertexLocation;

const vertexAI = new VertexAI({
    project: PROJECT_ID,
    location: LOCATION
});

// Using the stable Gemini 1.5 Flash 002 model
const model = vertexAI.getGenerativeModel({
    model: 'gemini-1.5-flash-002', 
    generationConfig: {
        maxOutputTokens: 256,
        temperature: 0.7,
    }
});

// Simple in-memory conversation store for the demo
const conversationStore: Record<string, { role: string; text: string }[]> = {};

router.post('/webhook', async (req, res) => {
    try {
        // Twilio Signature Validation
        const twilioSignature = req.headers['x-twilio-signature'] as string;
        // In production, use the configured public URL. In dev, fallback to host.
        // You MUST set WEBHOOK_BASE_URL in production.
        const baseUrl = process.env.WEBHOOK_BASE_URL || `https://${req.headers.host}`;
        const url = `${baseUrl}${req.originalUrl}`;
        const params = req.body;

        // Skip validation if explicitly disabled (ONLY for local dev without ngrok)
        const skipValidation = process.env.SKIP_TWILIO_VALIDATION === 'true';

        if (!skipValidation) {
            if (!config.twilioAuthToken) {
                 console.error('Missing TWILIO_AUTH_TOKEN for signature validation');
                 return res.status(500).send('Server Misconfiguration');
            }

            const isValid = twilio.validateRequest(
                config.twilioAuthToken,
                twilioSignature,
                url,
                params
            );

            if (!isValid) {
                console.warn(`[Security] Invalid Twilio Signature. URL: ${url}`);
                return res.status(403).send('Forbidden: Invalid Twilio Signature');
            }
        }

        const { From, Body } = req.body;
        console.log(`[Planexa SMS] Incoming from ${From}: ${Body}`);

        if (!conversationStore[From]) {
            conversationStore[From] = [];
        }

        // Fetch services from DB
        const eventTypes = await prisma.eventType.findMany({
            where: { isActive: true },
            select: { title: true, duration: true }
        });

        const servicesList = eventTypes.map(e => `- ${e.title} (${e.duration} min)`).join('\n');
        const historyText = conversationStore[From].map(m => `${m.role}: ${m.text}`).join('\n');
        
        const systemInstruction = `
You are a bilingual medical receptionist assistant for "Clinique Planexa" in Quebec.
Rules:
- Max 160 characters.
- Detect language (FR/EN) and reply in the same language.
- Suggest tomorrow 10am or 2pm.
- Be polite and professional.

Services:
${servicesList}
`;

        const fullPrompt = `${systemInstruction}\n\nHistory:\n${historyText}\nUser: ${Body}\nAssistant:`;

        console.log('[Planexa SMS] Generating content...');
        const result = await model.generateContent(fullPrompt);
        const responseData = await result.response;
        
        const aiResponseText = responseData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 
            "Désolé, je ne comprends pas.";

        console.log(`[Planexa SMS] AI Response: ${aiResponseText}`);

        conversationStore[From].push({ role: 'User', text: Body });
        conversationStore[From].push({ role: 'Assistant', text: aiResponseText });

        res.type('text/xml');
        res.send(`<Response><Message>${aiResponseText}</Message></Response>`);

    } catch (error: any) {
        console.error('[Planexa SMS Critical Error]:', error);
        // Clean error message for response
        const errMsg = error.message || "Unknown Error";
        res.type('text/xml');
        res.send(`<Response><Message>Erreur Système: ${errMsg.substring(0, 50)}</Message></Response>`);
    }
});

export default router;
