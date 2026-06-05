import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  Bot, 
  ArrowRight, 
  HelpCircle, 
  Loader2,
  AlertCircle,
  RefreshCw,
  User,
  Mic
} from "lucide-react";

export function CopilotWidget({ data }) {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: `👋 **Hi there! I am Kartikey's AI Career Copilot.** 

Ground truth portfolio data has been securely loaded into my system instructions. I can help answer questions about Kartikey's professional history, skills, and engineering background.

*Ask me questions like:*
- "What projects has Kartikey worked on?"
- "Which front-end frameworks is he comfortable with?"
- "Is Kartikey looking for internship roles?"
`
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isListening, setIsListening] = useState(false);
  
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto Scroll to Bottom on message updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return;
    
    const userMsgId = `user-${Date.now()}`;
    const userMessage = { id: userMsgId, role: "user", text: text };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const body = await response.json();

      if (!response.ok) {
        if (body.error === "Configuration Required") {
          throw new Error("CONFIG_MISSING");
        }
        throw new Error(body.message || "An error occurred while calling the copilot.");
      }

      setMessages(prev => [...prev, {
        id: `assist-${Date.now()}`,
        role: "assistant",
        text: body.answer
      }]);
    } catch (err) {
      console.error(err);
      if (err.message === "CONFIG_MISSING") {
        setErrorMessage("GEMINI_KEY_MISSING");
      } else {
        setMessages(prev => [...prev, {
          id: `err-${Date.now()}`,
          role: "assistant",
          isError: true,
          text: `⚠️ **Service Interrupted**\n\nI was unable to synthesize an answer. Please verify your internet connection or check the backend logs. Error details: *${err.message || 'Unknown network error'}*`
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(inputValue);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        text: `👋 **Copilot Reset Successfully.** Ask me questions about Kartikey Gaur's achievements, skills, project specs, or academic timeline.`
      }
    ]);
    setErrorMessage(null);
  };

  const handleSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      handleSendMessage(transcript);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div id="ai-chat-widget" className="flex flex-col h-full bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
      
      {/* Copilot Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-600 shadow-sm text-white">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-1.5 leading-none">
              AI Career Copilot
            </h3>
            <span className="text-[10px] font-mono text-emerald-600 font-medium">Grounded Context Engine v1.0</span>
          </div>
        </div>
        
        <button 
          onClick={clearChat}
          className="text-xs font-medium font-sans text-slate-500 hover:text-rose-600 px-2 py-1 rounded bg-white border border-slate-250 hover:bg-slate-50 transition"
          id="clear-chat-btn"
        >
          Reset Chat
        </button>
      </div>

      {/* Main Container - Chat content OR API Key Alert */}
      <div className="flex-1 flex flex-col min-h-0 bg-slate-50/20">
        {errorMessage === "GEMINI_KEY_MISSING" ? (
          <div className="p-6 flex-1 flex flex-col justify-center items-center text-center space-y-4" id="missing-key-card">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <AlertCircle className="w-6 h-6 animate-bounce" />
            </div>
            
            <div className="space-y-2 max-w-sm">
              <h4 className="font-bold text-slate-900 font-display">
                GEMINI_API_KEY Required
              </h4>
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                The Career Copilot relies on the Gemini API to analyze Kartikey's portfolio. Since you are running in AI Studio, you must provide your own API Key.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 text-left max-w-xs text-[11px] text-slate-600 space-y-2.5 font-sans leading-relaxed shadow-xs">
              <div className="flex gap-2">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center">1</span>
                <span>Open the **Secrets** panel in the AI Studio editor sidebar.</span>
              </div>
              <div className="flex gap-2">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-slate-100 text-slate-705 font-bold flex items-center justify-center">2</span>
                <span>Enable or add a key named **GEMINI_API_KEY** with your Gemini developer token.</span>
              </div>
              <div className="flex gap-2">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-slate-100 text-slate-705 font-bold flex items-center justify-center">3</span>
                <span>Click the button below to recognize the config setup.</span>
              </div>
            </div>

            <button
              onClick={() => handleSendMessage("Checking key connection...")}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
              id="reconect-key-btn"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        ) : (
          <>
            {/* Scrollable Chat Area */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-5 py-4 space-y-4 font-sans text-sm"
              id="chat-message-feed"
            >
              {messages.map((msg, index) => (
                <React.Fragment key={msg.id || index}>
                  <div 
                    className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                    id={`chat-message-${msg.role}-${index}`}
                  >
                    <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center shadow-xs ${
                      msg.role === "user" 
                        ? "bg-slate-200 text-slate-700" 
                        : msg.isError 
                          ? "bg-rose-50 border border-rose-200 text-rose-600" 
                          : "bg-rose-50 border border-rose-100 text-rose-700"
                    }`}>
                      {msg.role === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>

                    <div className={`rounded-2xl px-4 py-2.5 leading-relaxed text-slate-800 border ${
                      msg.role === "user"
                        ? "bg-rose-600/5 text-slate-850 border-rose-100 rounded-tr-none"
                        : msg.isError
                          ? "bg-rose-50/50 border-rose-100 rounded-tl-none text-rose-850"
                          : "bg-white border-slate-100 rounded-tl-none shadow-xs"
                    }`}>
                      {/* Parse markdown styling */}
                      <div className="space-y-2 whitespace-pre-wrap text-sm break-words prose-slate">
                        {msg.text.split("\n\n").map((para, pIdx) => {
                          if (para.startsWith("- ") || para.startsWith("* ")) {
                            const items = para.split(/\n[-*]\s+/);
                            return (
                              <ul key={pIdx} className="list-disc pl-4 space-y-1">
                                {items.map((item, iIdx) => {
                                  if (iIdx === 0 && (item.startsWith("-") || item.startsWith("*"))) {
                                    return null;
                                  }
                                  return (
                                    <li key={iIdx} className="text-slate-700">
                                      {renderInlineMarkdown(item)}
                                    </li>
                                  );
                                })}
                              </ul>
                            );
                          }
                          
                          return (
                            <p key={pIdx} className="text-slate-700">
                              {renderInlineMarkdown(para)}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Integrate sample questions inside the first message chat flow */}
                  {index === 0 && (msg.id === "welcome" || msg.id === "welcome-reset") && (
                    <div className="flex flex-col gap-2 pl-10 pr-4 pt-1 pb-4" id="chat-suggestions-panel">
                      <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span className="text-[10.5px] font-bold uppercase tracking-wider font-mono">Suggested Questions</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {data.sampleQA.map((qa, qaIdx) => (
                          <button
                            key={qaIdx}
                            onClick={() => handleSendMessage(qa.question)}
                            disabled={isLoading}
                            className="text-left text-[13px] bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 transition text-slate-700 py-2 px-3 rounded-xl shadow-xs max-w-full leading-snug break-words"
                          >
                            {qa.question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}

              {isLoading && (
                <div className="flex gap-3 max-w-[80%] mr-auto" id="chat-typing-loader">
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs space-y-1">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
                      <span>Copilot is searching index...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>
          </>
        )}

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-100" id="chat-input-bar">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading || errorMessage === "GEMINI_KEY_MISSING"}
              placeholder={
                errorMessage === "GEMINI_KEY_MISSING"
                   ? "Configure GEMINI_API_KEY to ask questions..."
                   : isListening 
                     ? "Listening..."
                     : "Ask about Kartikey's skills, BITS GPA, projects..."
              }
              className="w-full pl-4 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition duration-200 disabled:opacity-50 text-slate-800 placeholder-slate-400 font-sans"
              id="message-input-field"
            />
            <div className="absolute right-2 flex items-center gap-1">
              <button
                onClick={handleSpeech}
                disabled={isLoading || errorMessage === "GEMINI_KEY_MISSING"}
                className={`p-2 rounded-lg transition ${isListening ? 'bg-rose-100 text-rose-600 animate-pulse' : 'hover:bg-slate-200 text-slate-500'}`}
                title="Voice Command"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isLoading || errorMessage === "GEMINI_KEY_MISSING"}
                className="p-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-lg transition"
                id="send-message-btn"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-light text-center font-sans">
            AI responses are strictly grounded in Kartikey's records. Hallucinations are guarded.
          </p>
        </div>
      </div>
    </div>
  );
}

// Minimal inline markdown parser helper to render bold text securely
function renderInlineMarkdown(text) {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    const prevText = text.substring(lastIndex, match.index);
    if (prevText) parts.push(prevText);
    
    parts.push(
      <strong key={match.index} className="font-bold text-slate-950 font-sans">
        {match[1]}
      </strong>
    );
    lastIndex = boldRegex.lastIndex;
  }

  const remaining = text.substring(lastIndex);
  if (remaining) parts.push(remaining);

  return parts.length > 0 ? parts : text;
}
