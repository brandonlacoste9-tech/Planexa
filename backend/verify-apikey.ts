
import { GoogleGenerativeAI } from '@google/generative-ai';

// API Key provided by user
const API_KEY = "AQ.Ab8RN6JbH58Xv69FNXdQKMLFaVBEMHHayM2rp2b82uYMh1guaQ";

async function main() {
    const genAI = new GoogleGenerativeAI(API_KEY);
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
