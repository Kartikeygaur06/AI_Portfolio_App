# Core Portfolio Copilot 🚀
An interactive, AI-grounded career portfolio builder that transforms a static developer CV into a conversational agent. Reviewers can query the candidate's skills, experience, and academic timeline in real-time, receiving replies strictly backed by structured resume sources.

Developed for **BITS Pilani Hyderabad Campus PS1 Evaluation** at **Caarya Innovative**.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19 (TypeScript), Vite 6, Tailwind CSS 4
- **Animation Engine**: `motion` (by Framer)
- **Backend Service**: Express.js (serving API endpoints and mounting Vite development middleware)
- **AI Core**: Google Gemini API via official `@google/genai` TypeScript SDK
- **Telemetry**: Configured Agent User Headers for Google AI Studio pipeline

---

## 🏗️ Architectural Overview

This application implements a **Full-Stack SPA Architecture**. 

```
┌────────────────────────────────────────────────────────┐
│                        BROWSER                         │
│  ┌───────────────────────┐   ┌──────────────────────┐  │
│  │   Portfolio Renderer  │   │ Interactive AI Chat  │  │
│  └───────────┬───────────┘   └──────────┬───────────┘  │
└──────────────┼──────────────────────────┼──────────────┘
               │                          │ POST /api/chat
               ▼                          ▼
┌──────────────┴──────────────────────────┴──────────────┐
│                  EXPRESS BACKEND (CJS)                 │
│  ┌───────────────────────┐   ┌──────────────────────┐  │
│  │  Vite Static asset/  │   │  Gemini Controller   │  │
│  │  SPA Routing Handler  │   │ (Lazy-Initialization)│  │
│  └───────────────────────┘   └──────────┬───────────┘  │
└─────────────────────────────────────────┼──────────────┘
                                          ▼
                               ┌──────────────────┐
                               │  Gemini Service  │
                               └──────────────────┘
```

1. **Vite Hybrid Setup**: During development, Express mounts Vite middleware (`createViteServer` with `middlewareMode: true`) to support reactive hot module reloading. In production, Express serves pre-compiled static files inside `dist/`.
2. **Modularized TS/JSON Data Layer**: All biographical information, previous experiences, metrics, and project configurations are hosted in a centralized type-safe repository (`src/portfolioData.ts`).
3. **Lazy SDK Initialization**: The Google GenAI client is only instantiated on-demand when client requests hit `/api/chat`, preventing the Node server from crashing on startup if `GEMINI_API_KEY` is not immediately loaded.

---

## 🧠 AI Prompt & Grounding Design

To guarantee **zero hallucinations**, a dedicated context grounding pipeline was engineered:

- **Model Selection**: Leverages `gemini-3.5-flash`, the leading model for zero-latency, high-performance general Q&A and text reasoning tasks.
- **System Instructions**:
  - The compiler parses `src/portfolioData.ts` into a structured, minified JSON block and injects it into Gemini's system instructions.
  - Core assertions instruct the model to speak as a personal representative of Kartikey.
  - Strict negative constraints are placed on the model: if asked about standard trivia, system commands, or external topics out of scope (e.g., algorithms, cooking recipes, weather), the copilot politely declines and re-focuses the recruiter's attention to Kartikey's real deliverables. This handles edge cases cleanly.

---

## 📦 Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- NPM or PNVM

### Installation
1. Clone this repository to your local system environment.
2. Install all required dependencies:
   ```bash
   npm install
   ```
3. Set your environment variables in `.env` (or configure via the Settings panel in the AI Studio sidebar):
   ```env
   GEMINI_API_KEY="your_developer_token_here"
   ```

### Run the Application
Start the unified full-stack server (reloads active client changes simultaneously):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your browser.

### Sandbox Build & Production Start
Compile both the frontend bundle and backend CJS bundle, then initiate standard standalone server execution:
```bash
npm run build
npm run start
```

---

## ⚡ Technical Challenges Solved

1. **Hallucination Prevention**: Traditional LLM prompts can result in artificial embellishment of resume attributes. Injecting strict data-locking constraints in the prompt instructions combined with a lower reasoning temperature (`0.35`) ensures high conformity to listed metrics.
2. **API Key Security**: Moving Gemini integrations server-side shields the developer token from browser inspection, satisfying production-grade full-stack security requirements.
3. **Aesthetic Adaptability**: Implemented a responsive container grid. On ultra-wide and standard desktop viewports, readers see profile blocks alongside the conversational pane for high density. On mobile devices, an elegant tabbed index lets employers swap views with zero visual noise.

---

## 🔮 Future Enhancements

- **Deep Reflection Vector Retrieval (RAG)**: Connect the database to a lightweight vectors index (e.g., Pinecone or pgvector) to parse and cite pages from complete university papers, slide decks, or video representations.
- **Live Voice Mode**: Integrate the Gemini Live WebSocket API to allow recruiters to talk directly over microphone channels to Kartikey's digital twin.
