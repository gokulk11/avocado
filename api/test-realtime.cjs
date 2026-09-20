const fs = require("fs");

const env = fs.readFileSync(".env", "utf8");

const match = env.match(/^OPENAI_API_KEY=(.+)$/m);

if (!match) {
  console.log("❌ OPENAI_API_KEY not found in .env");
  process.exit(1);
}

const apiKey = match[1].trim();

async function testRealtime() {
  try {
    console.log("🔄 Testing OpenAI Realtime API...");

    const response = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session: {
            type: "realtime",
            model: "gpt-realtime",
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("❌ Realtime API failed");
      console.log(data);
      return;
    }

    console.log("✅ Realtime API is working!");
    console.log(
      "Session token received:",
      !!data.value
    );
  } catch (error) {
    console.log("❌ Connection error:");
    console.log(error.message);
  }
}

testRealtime();