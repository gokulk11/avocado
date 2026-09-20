const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");

const env = fs.readFileSync(".env.local", "utf8");

const match = env.match(/^GEMINI_API_KEY=(.+)$/m);

if (!match) {
  console.log("❌ GEMINI_API_KEY not found in .env.local");
  process.exit(1);
}

const apiKey = match[1].trim();

async function testGemini() {
  try {
    console.log("🔄 Testing Gemini API...");

    const ai = new GoogleGenAI({
      apiKey,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Say exactly: Gemini API is working!",
    });

    console.log("✅ Gemini API is working!");
    console.log("Response:", response.text);
  } catch (error) {
    console.log("❌ Gemini API failed:");
    console.log(error.message);
  }
}

testGemini();