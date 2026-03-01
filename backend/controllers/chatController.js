/**
 * Chat Controller — Groq-powered Wellness Chatbot
 * Uses Groq API with Llama model to provide wellness, fitness, nutrition,
 * sleep, and mental health guidance for IIT campus students.
 */

const GROQ_API_KEY = process.env.GROQAPI;
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are VITA Wellness Assistant, an AI companion for IIT campus students. Your role:

**SCOPE:** Only answer questions about:
- Fitness & exercise (gym, running, yoga, sports)
- Nutrition & diet (Indian food focus - mess food, hostel cooking)
- Mental wellness (stress, anxiety, exam pressure, sleep)
- Campus wellness (study-life balance, hostel life)
- BMI/weight management
- Hydration & recovery

**PERSONALITY:**
- Warm, encouraging, like a supportive senior/mentor
- Use simple language, relatable to Indian college students
- Give practical, actionable advice
- Reference campus/hostel context when relevant

**RULES:**
- Keep responses concise (2-4 short paragraphs max)
- Use emojis sparingly for warmth 💪
- If asked something outside wellness/health, politely redirect
- Never diagnose medical conditions — suggest visiting the campus health center
- For meal suggestions, prefer Indian foods available in mess/canteen
- Use metric units (kg, cm)`;

const chat = async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ message: 'Message is required.' });
        }

        if (!GROQ_API_KEY) {
            return res.status(500).json({ message: 'Groq API key not configured.' });
        }

        // Build messages array for Groq
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            // Include recent conversation history (last 10 messages max)
            ...history.slice(-10).map(h => ({
                role: h.role,
                content: h.content
            })),
            { role: 'user', content: message }
        ];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages,
                temperature: 0.7,
                max_tokens: 512,
                top_p: 0.9,
            }),
        });

        if (!response.ok) {
            const errData = await response.text();
            console.error('Groq API error:', response.status, errData);
            throw new Error(`Groq API error: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || 'I couldn\'t generate a response. Please try again.';

        res.json({ reply });
    } catch (error) {
        console.error('chat error:', error);
        res.status(500).json({
            message: 'Failed to get a response from the wellness assistant.',
            reply: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment. 🙏'
        });
    }
};

module.exports = { chat };
