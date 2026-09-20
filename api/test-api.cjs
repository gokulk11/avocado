const fs = require("fs");

const env = fs.readFileSync(".env", "utf8");

const match = env.match(/^OPENAI_API_KEY=(.+)$/m);

if (!match) {
  console.log("❌ OPENAI_API_KEY not found in .env");
  process.exit(1);
}

const apiKey = match[1].trim();

fetch("https://api.openai.com/v1/models", {
  headers: {
    Authorization: `Bearer ${apiKey}`,
  },
})
  .then(async (response) => {
    const data = await response.json();

    if (!response.ok) {
      console.log("❌ API error:");
      console.log(data);
      return;
    }

    console.log("✅ OpenAI API key is working!");
    console.log(`Models returned: ${data.data?.length ?? 0}`);
  })
  .catch((error) => {
    console.log("❌ Connection error:");
    console.log(error.message);
  });