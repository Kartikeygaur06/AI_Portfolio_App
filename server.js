import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { portfolioData } from "./src/portfolioData.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client reference
let aiClient = null;

function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY" || key.trim() === "") {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it via the Secrets panel in the AI Studio sidebar.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST APIs
app.get("/api/portfolio", (req, res) => {
  res.json(portfolioData);
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "A message payload is required." });
      return;
    }

    let ai;
    try {
      ai = getGeminiClient();
    } catch (err) {
      console.warn("Gemini client initialization failed (expected behavior if key is not set yet):", err.message);
      res.status(400).json({ 
        error: "Configuration Required", 
        message: err.message 
      });
      return;
    }

    // Context grounding instruction payload
    const systemInstruction = `You are Kartikey Gaur's "AI Career Copilot", an intelligent full-stack career representative grounded strictly in Kartikey Gaur's actual portfolio data.
Your objective is to answer professional questions from recruiters, reviews, and engineers about Kartikey's skills, projects, experience, and education.

Here is Kartikey Gaur's actual professional portfolio data:
${JSON.stringify(portfolioData, null, 2)}

Strict Guidelines to follow:
1. Always answer in the first person ('I', 'my time at Caarya') as Kartikey, or representing him gracefully ('Kartikey worked on...', 'I completed...'). Speaking in first-person feels warmer and more immediate, but you can also introduce yourself as his digital assistant if preferred.
2. Under no circumstances should you make up or extrapolate achievements, metrics, roles, grades, or facts that are not present in the provided portfolio data.
3. If an unknown question or one completely unrelated to Kartikey's professional life, education, or portfolio is asked (e.g. 'what is the weather today?', 'code a python sorting algorithm', 'give me a recipe for cookies'), ALWAYS decline to answer gracefully saying it is out of scope. For example: 
   "That sound interesting, but as Kartikey's AI Copilot, I am designed to answer questions about his software skills, projects, and work at Caarya Innovative. Let me know if you would like me to summarize his technical stack or talk about the Swarm Robotics project!"
4. Ground your answers accurately and include references to Kartikey's real experiences (like his PS1 internship at Caarya Innovative, or his ECE degree at BITS Hyderabad).
5. Format your answers beautifully and clearly utilizing markdown lists, bold titles, and clean typography. Avoid long-winded paragraphs. Keep responses concise.`;

    // Process chat request with model fallback
    const modelsToTry = ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
    let aiResponseText = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: message,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.35,
          },
        });
        aiResponseText = response.text || "I was unable to retrieve a response from the AI Copilot. Please try again.";
        break; // Success, exit loop
      } catch (err) {
        lastError = err;
        console.warn(`Model ${modelName} failed. Error:`, err?.message || err);
        continue;
      }
    }

    if (!aiResponseText) {
      console.error("All models failed. Last error at Express /api/chat:", lastError);
      
      const errMsg = lastError?.message || "";
      const isQuota = errMsg.includes("quota") || errMsg.includes("429");
      const isBusy = errMsg.includes("high demand") || errMsg.includes("503");
      
      let userFriendlyMessage = "Sorry, I am having trouble connecting to my AI processor right now. Please try again later.";
      if (isQuota) userFriendlyMessage = "Sorry, I've answered too many questions recently and exceeded my API quota! Please try asking again in a little while.";
      if (isBusy) userFriendlyMessage = "Sorry, my AI model is currently experiencing high demand. Spikes in demand are usually temporary, please try again in a few seconds!";
      
      return res.json({ answer: userFriendlyMessage });
    }

    res.json({ answer: aiResponseText });
  } catch (error) {
    console.error("Outer Error at Express /api/chat:", error);
    res.status(500).json({ 
      error: "Unexpected Error", 
      message: "An unexpected internal server error occurred." 
    });
  }
});

// Vite Middleware Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Portfolio Copilot server successfully running on http://localhost:${PORT}`);
  });
}

startServer();
