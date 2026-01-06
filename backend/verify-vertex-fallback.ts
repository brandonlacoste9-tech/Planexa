import { VertexAI } from '@google-cloud/vertexai';
import dotenv from 'dotenv';
dotenv.config();

const PROJECT_ID = process.env.VERTEX_PROJECT_ID;
const LOCATION = process.env.VERTEX_LOCATION || 'us-central1';

async function main() {
    if (!PROJECT_ID) {
        console.error('❌ Error: VERTEX_PROJECT_ID is missing from .env');
        process.exit(1);
    }
    
    const vertexAI = new VertexAI({
        project: PROJECT_ID,
        location: LOCATION
    });

    console.log(`Testing Vertex AI (${LOCATION})...`);

    try {
        // Trying 'gemini-1.0-pro' as a fallback if 1.5 is region-locked or named differently
        const model = vertexAI.getGenerativeModel({ model: 'gemini-1.0-pro-001' });
        const result = await model.generateContent('Status check.');
        const response = await result.response;
        console.log('SUCCESS (gemini-1.0-pro-001):', response.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (error: any) {
        console.error('ERROR (gemini-1.0-pro-001):', error.message);
    }
}

main();
