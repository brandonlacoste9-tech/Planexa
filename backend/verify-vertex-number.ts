import { VertexAI } from '@google-cloud/vertexai';
import dotenv from 'dotenv';
dotenv.config();

// Default values can be kept for fallback if intended for dev, 
// but strictly speaking we should use env vars.
const PROJECT_ID = process.env.VERTEX_PROJECT_ID;
const LOCATION = process.env.VERTEX_LOCATION || 'us-central1';

async function main() {
    if (!PROJECT_ID) {
        console.error('❌ Error: VERTEX_PROJECT_ID is missing from .env');
        process.exit(1);
    }
    
    // Testing with Project Number/ID from env
    const vertexAI = new VertexAI({
        project: PROJECT_ID,
        location: LOCATION
    });

    console.log(`Testing Vertex AI with Project ${PROJECT_ID}...`);

    try {
        const model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });
        const result = await model.generateContent('Status check.');
        const response = await result.response;
        console.log('SUCCESS:', response.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (error: any) {
        console.error('ERROR:', error.message);
    }
}

main();
