export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { prompt, width, height } = req.body;
    const seed = Math.floor(Math.random() * 999999);
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;

    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    if (!response.ok) {
      throw new Error(`Image generation failed: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const contentType = response.headers.get("content-type") || "image/jpeg";

    return res.status(200).json({
      image: `data:${contentType};base64,${base64}`
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
