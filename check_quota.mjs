import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
if (!apiKey) {
  console.error("❌ API_KEY not found. Set GEMINI_API_KEY or API_KEY environment variable.");
  process.exit(1);
}
const ai = new GoogleGenAI({ apiKey });

async function checkKey() {
  console.log("Testing API Key connection...");
  try {
    const response = await ai.models.generateContent({
  	      model: 'gemini-3-flash-preview',
      contents: { role: 'user', parts: [{ text: 'Reply with "OK" if you can hear me.' }] }
    });
    
    console.log("✅ Success! API Key is working.");
    console.log("Response:", response.text);
    
    // Check for rate limit headers
    if (response.headers) {
      console.log("\n📊 Rate Limit Information:");
      console.log("Requests remaining:", response.headers['x-ratelimit-remaining-requests'] || "N/A");
      console.log("Requests limit:", response.headers['x-ratelimit-limit-requests'] || "N/A");
      console.log("Tokens remaining:", response.headers['x-ratelimit-remaining-tokens'] || "N/A");
      console.log("Tokens limit:", response.headers['x-ratelimit-limit-tokens'] || "N/A");
    }
  } catch (error) {
    console.log("❌ Error detected.");
    console.log("Message:", error.message);
    
    if (error.message.includes("429") || error.message.includes("Quota")) {
      console.log("⚠️ DIAGNOSIS: QUOTA EXCEEDED (429)");
    } else if (error.message.includes("403") || error.message.includes("API key not valid")) {
      console.log("⚠️ DIAGNOSIS: INVALID KEY");
    }
  }
}

checkKey();