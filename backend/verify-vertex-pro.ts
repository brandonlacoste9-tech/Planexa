
import { VertexAI } from '@google-cloud/vertexai';

async function main() {
    process.env['GOOGLE_APPLICATION_CREDENTIALS'] = 'c:\\Users\\north\\ZyeuteV5\\zyeute-ai-key.json';
    
    // Testing OLD RELIABLE gemini-pro in us-central1
    const vertexAI = new VertexAI({
        project: 'unique-spirit-482300-s4',
        location: 'us-central1'
    });

    console.log('Testing gemini-pro (us-central1)...');

    try {
        const model = vertexAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent('Status check.');
        const response = await result.response;
        console.log('SUCCESS:', response.candidates[0].content.parts[0].text);
    } catch (error: any) {
        console.error('ERROR:', error.message);
    }
}

main();
