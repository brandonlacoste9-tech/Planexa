
import { VertexAI } from '@google-cloud/vertexai';

async function main() {
    process.env['GOOGLE_APPLICATION_CREDENTIALS'] = 'c:\\Users\\north\\ZyeuteV5\\zyeute-ai-key.json';
    
    // We'll try to instantiate a client but we can't "list models" easily with this SDK 
    // without a model reference.
    // Instead, let's try a direct REST call relative to the project using the token from the key.
    
    // Actually, let's try a known "available" model like 'publishers/google/models/gemini-1.0-pro'
    // Verification: maybe the location is wrong?
    
    const vertexAI = new VertexAI({
        project: 'unique-spirit-482300-s4', // ID
        location: 'us-central1'
    });

    try {
        console.log("Attempting `gemini-1.5-pro`...");
        const model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        const res = await model.generateContent("Test");
        console.log("Success with gemini-1.5-pro");
    } catch (e: any) {
        console.log("Failed gemini-1.5-pro: " + e.message);
    }
}
main();
