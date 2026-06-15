const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chatBot = async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Message is required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are the Inspirability AI assistant — a warm, knowledgeable guide on the Inspirability platform.

Inspirability is an Egyptian platform that helps parents of children with special needs find:
- Inclusive schools and learning centers (browse at /schools)
- Medical clinics and therapy centers (browse at /medical)
- Adaptive sports and activity centers (browse at /sports)
- Private teachers, doctors, and trainers (browse at /contacts)

You can also help parents with:
- Booking an appointment with a provider
- Signing up and creating a parent account
- Understanding what types of support are available (autism, ADHD, Down syndrome, physical disabilities, etc.)
- Tips for choosing the right school or therapy type for their child

Keep replies friendly and concise (3–5 sentences max).
Reply in the same language the user writes in (Arabic or English).
If asked about something outside your scope, politely redirect to what you can help with.

Parent message: ${message.trim()}
`;

    const result   = await model.generateContent(prompt);
    const reply    = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error("Gemini error:", err?.message || err);
    res.status(500).json({ message: "AI service error. Please try again." });
  }
};
