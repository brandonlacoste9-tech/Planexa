import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load env vars if running standalone
dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
    console.error('❌ Error: GOOGLE_API_KEY environment variable is missing.');
    process.exit(1);
}

async function main() {
    const genAI = new GoogleGenerativeAI(API_KEY as string);
    console.log('Testing Gemini API Key...');

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello! Are you working?");
        const response = await result.response;
        console.log('SUCCESS:', response.text());
    } catch (error: any) {
        console.error('ERROR:', error.message);
    }
}

main();
