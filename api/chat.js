export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { system, messages } = req.body || {};
  try {
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: messages.map(m => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.text }] }))
        })
      }
    );
    const d = await r.json();
    const text = d?.candidates?.[0]?.content?.parts?.[0]?.text || "Hmm, I couldn't think of a reply. Try again 🙂";
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ text: "Connection problem 😕" });
  }
}
