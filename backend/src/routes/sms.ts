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

// Simple in-memory conversation store for the demo
const conversationStore: Record<string, { role: string; text: string }[]> = {};

router.post('/webhook', async (req, res) => {
    try {
        const { From, Body } = req.body;
        console.log(`[Planexo SMS] Message entrant de ${From}: ${Body}`);
        console.log(`[Planexo SMS] Utilisation de Vertex AI - Projet: ${PROJECT_ID}, Région: ${LOCATION}`);

        if (!conversationStore[From]) {
            conversationStore[From] = [];
        }

        // Fetch services from DB
        const eventTypes = await prisma.eventType.findMany({
            where: { isActive: true },
            select: { title: true, duration: true }
        });

        const servicesList = eventTypes.map((e: { title: string; duration: number }) => `- ${e.title} (${e.duration} min)`).join('\n');
        const historyText = conversationStore[From].map(m => `${m.role}: ${m.text}`).join('\n');
        
        const systemInstruction = `
Tu es un assistant réceptionniste bilingue pour "Clinique Planexo" au Québec.
Règles:
- Maximum 160 caractères.
- Détecte la langue (FR/EN) et réponds dans la même langue.
- Propose demain 10h ou 14h.
- Sois poli et professionnel.
- Utilise le français québécois naturel (pas de "vous", utilise "tu").
- Sois chaleureux et accueillant, comme un vrai Québécois.

Services:
${servicesList}
`;

        const fullPrompt = `${systemInstruction}\n\nHistory:\n${historyText}\nUser: ${Body}\nAssistant:`;

        console.log('[Planexo SMS] Génération de la réponse...');
        const result = await model.generateContent(fullPrompt);
        const responseData = await result.response;
        
        const aiResponseText = responseData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 
            "Désolé, j'ai pas compris. Peux-tu réessayer?";

        console.log(`[Planexo SMS] AI Response: ${aiResponseText}`);

        conversationStore[From].push({ role: 'User', text: Body });
        conversationStore[From].push({ role: 'Assistant', text: aiResponseText });

        res.type('text/xml');
        res.send(`<Response><Message>${aiResponseText}</Message></Response>`);

    } catch (error: any) {
        console.error('[Planexo SMS - Erreur critique]:', error);
        // Clean error message for response
        res.type('text/xml');
        res.send(`<Response><Message>Désolé, il y a eu une erreur. On s'en occupe!</Message></Response>`);
    }
});

export default router;
