
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AQ.Ab8RN6JbH58Xv69FNXdQKMLFaVBEMHHayM2rp2b82uYMh1guaQ";
const genAI = new GoogleGenerativeAI(API_KEY);

const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro"];

async function test() {
    console.log("Testing API Key with multiple models...");
    for (const modelName of models) {
        try {
            console.log(`Trying ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            console.log(`✅ SUCCESS with ${modelName}:`, result.response.text());
            return; // Found one!
        } catch (e) {
            console.log(`❌ FAILED ${modelName}:`, e.message.split('\n')[0]);
        }
    }
}

test();
