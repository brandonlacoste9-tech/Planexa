
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AQ.Ab8RN6JbH58Xv69FNXdQKMLFaVBEMHHayM2rp2b82uYMh1guaQ";
const genAI = new GoogleGenerativeAI(API_KEY);

async function test() {
    console.log("Testing gemini-2.5-flash-lite...");
    try {
        // Precise model name from user's curl
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        const result = await model.generateContent("Hi");
        console.log("✅ SUCCESS:", result.response.text());
    } catch (e) {
        console.log("❌ FAILED:", e.message);
    }
}

test();
