
import { VertexAI } from '@google-cloud/vertexai';

async function main() {
    process.env['GOOGLE_APPLICATION_CREDENTIALS'] = 'c:\\Users\\north\\ZyeuteV5\\zyeute-ai-key.json';
    
    // Explicit project and location from user's Zyeute configuration
    // Trying 'us-central1' as it's the most common for standard models
    const vertexAI = new VertexAI({
        project: 'unique-spirit-482300-s4',
        location: 'us-central1'
    });

    console.log('Testing Vertex AI (us-central1)...');

    try {
        // Trying 'gemini-1.0-pro' as a fallback if 1.5 is region-locked or named differently
        const model = vertexAI.getGenerativeModel({ model: 'gemini-1.0-pro-001' });
        const result = await model.generateContent('Status check.');
        const response = await result.response;
        console.log('SUCCESS (gemini-1.0-pro-001):', response.candidates[0].content.parts[0].text);
    } catch (error: any) {
        console.error('ERROR (gemini-1.0-pro-001):', error.message);
    }
}

main();
