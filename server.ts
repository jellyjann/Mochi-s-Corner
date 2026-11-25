import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini AI client server-side
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API endpoint for multi-turn Gemini Chat
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message, model = 'gemini-4-hydrogen', history = [], systemInstruction } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Format history correctly for ai.chats.create
      const formattedHistory = Array.isArray(history)
        ? history.map((h: any) => ({
            role: h.role === 'model' ? 'model' : 'user',
            parts: [{ text: h.parts?.[0]?.text || h.text || '' }],
          }))
        : [];

      const chat = ai.chats.create({
        model,
        history: formattedHistory,
        config: {
          systemInstruction:
            systemInstruction ||
            "You are Mochi, a cozy, encouraging, and wise virtual study companion in Mochi's Corner. Help the user stay focused, plan tasks, overcome study fatigue, and maintain motivation with warmth and kindness.",
        },
      });

      const response = await chat.sendMessage({ message });
      res.json({ text: response.text || '' });
    } catch (error: any) {
      console.error('Gemini Chat API Error:', error);
      res.status(500).json({ error: error.message || 'Internal server error while communicating with Gemini.' });
    }
  });

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server & Vite running on http://localhost:${port}`);
  });
}

startServer();
