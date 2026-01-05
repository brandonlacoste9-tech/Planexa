
import { VertexAI } from '@google-cloud/vertexai';

async function main() {
    process.env['GOOGLE_APPLICATION_CREDENTIALS'] = 'c:\\Users\\north\\ZyeuteV5\\zyeute-ai-key.json';
    
    // Testing with Project Number instead of ID
    const vertexAI = new VertexAI({
        project: '929162598124', 
        location: 'us-central1'
    });

    console.log('Testing Vertex AI with Project NUMBER...');

    try {
        const model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });
        const result = await model.generateContent('Status check.');
        const response = await result.response;
        console.log('SUCCESS:', response.candidates[0].content.parts[0].text);
    } catch (error: any) {
        console.error('ERROR:', error.message);
    }
}

main();
