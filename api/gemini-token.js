export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/auth_tokens",
      {
        method: "POST",

        headers: {
          "x-goog-api-key": process.env.GEMINI_API_KEY,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          uses: 1,

          expireTime: new Date(
            Date.now() + 30 * 60 * 1000
          ).toISOString(),

          newSessionExpireTime: new Date(
            Date.now() + 1 * 60 * 1000
          ).toISOString(),
        }),
      }
    );

    const data = await response.json();

    console.log("Gemini response:", data);

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          data.error?.message ||
          "Gemini token request failed",
      });
    }

    console.log("✅ Gemini ephemeral token created");

    return res.status(200).json({
      token: data.name,
    });
  } catch (error) {
    console.error("❌ Gemini token error:", error);

    return res.status(500).json({
      error:
        error.message ||
        "Failed to create Gemini token",
    });
  }
}