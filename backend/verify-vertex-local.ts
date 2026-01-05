
import { VertexAI } from '@google-cloud/vertexai';

async function main() {
    process.env['GOOGLE_APPLICATION_CREDENTIALS'] = 'c:\\Users\\north\\ZyeuteV5\\zyeute-ai-key.json';
    
    const vertexAI = new VertexAI({
        project: 'unique-spirit-482300-s4',
        location: 'us-central1'
    });

    console.log('Testing Vertex AI Access...');

    try {
        const model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Say "Vertex Access Confirmed" if this works.');
        const response = await result.response;
        console.log('SUCCESS:', response.candidates[0].content.parts[0].text);
    } catch (error: any) {
        console.error('ERROR:', error.message);
    }
}

main();
