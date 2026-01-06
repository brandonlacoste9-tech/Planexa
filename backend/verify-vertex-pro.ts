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

    // Testing OLD RELIABLE gemini-pro in us-central1
    const vertexAI = new VertexAI({
        project: PROJECT_ID,
        location: LOCATION
    });

    console.log(`Testing gemini-pro (${LOCATION})...`);

    try {
        const model = vertexAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent('Status check.');
        const response = await result.response;
        console.log('SUCCESS:', response.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (error: any) {
        console.error('ERROR:', error.message);
    }
}

main();
