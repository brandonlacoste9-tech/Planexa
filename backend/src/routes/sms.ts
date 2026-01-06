import { Router } from 'express';
import { VertexAI } from '@google-cloud/vertexai';
import prisma from '../lib/prisma';

const router = Router();

// Configuration for Vertex AI (using Cloud Run Service Account Identity)
const PROJECT_ID = 'unique-spirit-482300-s4';
const LOCATION = 'us-central1';

const vertexAI = new VertexAI({
    project: PROJECT_ID,
    location: LOCATION
});

// Using the stable Gemini 1.5 Flash 002 model
// This model is generally available and efficient for SMS use cases.
const model = vertexAI.getGenerativeModel({
    model: 'gemini-1.5-flash-002', 
    generationConfig: {
        maxOutputTokens: 256,
        temperature: 0.7,
    }
});

router.post('/webhook', async (req, res) => {
    try {
        const { From, Body } = req.body;
        console.log(`[Planexa SMS] Incoming from ${From}: ${Body}`);
        console.log(`[Planexa SMS] Using Vertex AI Project: ${PROJECT_ID}, Location: ${LOCATION}`);

        // 1. Log Incoming Message
        await prisma.smsLog.create({
            data: {
                phoneNumber: From,
                message: Body,
                direction: 'INBOUND',
                status: 'received'
            }
        });

        // 2. Fetch Conversation History (Last 10 messages)
        const history = await prisma.smsLog.findMany({
            where: { phoneNumber: From },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        // Reverse to chronological order
        const conversationHistory = history.reverse();

        // 3. Fetch services from DB
        const eventTypes = await prisma.eventType.findMany({
            where: { isActive: true },
            select: { title: true, duration: true }
        });

        const servicesList = eventTypes.map(e => `- ${e.title} (${e.duration} min)`).join('\n');
        
        // Format history for prompt
        const historyText = conversationHistory.map(m => {
             const role = m.direction === 'INBOUND' ? 'User' : 'Assistant';
             return `${role}: ${m.message}`;
        }).join('\n');
        
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

        // 4. Log Outgoing Message
        await prisma.smsLog.create({
            data: {
                phoneNumber: From,
                message: aiResponseText,
                direction: 'OUTBOUND',
                status: 'sent'
            }
        });

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
