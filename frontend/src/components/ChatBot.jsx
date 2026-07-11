import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, MessageSquare, X } from "lucide-react";
import { sendChat } from "../services/api";

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"} animate-fade-up`}>
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border
                    ${isUser ? "bg-blue-600/10 border-blue-500/20 text-blue-400" : "bg-white/5 border-white/10 text-white/80"}`}
      >
        {isUser ? <User size={13} /> : <Bot size={13} />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed border
                    ${isUser
                      ? "bg-blue-600/15 border-blue-500/20 text-white rounded-tr-sm"
                      : "bg-white/5 border-white/5 text-white/90 rounded-tl-sm"
                    }`}
      >
        {msg.content}
      </div>
    </div>
  );
}

export default function ChatBot({ city }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: city
        ? `I'm CityPulse AI 🤖 — Ask me anything about ${city}'s weather, news, or general info!`
        : "I'm CityPulse AI 🤖 — Search a city first, then ask me anything about it!",
    },
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId]   = useState(null);
  const [open, setOpen]       = useState(false);
  const bottomRef             = useRef(null);

  // Update welcome message when city changes
  useEffect(() => {
    if (city) {
      setMessages([
        {
          role: "assistant",
          content: `City switched to **${city}**! I now have live weather and news context. Ask me anything!`,
        },
      ]);
      setChatId(null);
    }
  }, [city]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendChat(input.trim(), city, chatId);
      setChatId(data.chatId);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't connect to the AI service. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-blue-600
                   flex items-center justify-center shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]
                   hover:bg-blue-500 active:scale-95 transition-all duration-150"
      >
        {open ? <X size={20} className="text-white" /> : <MessageSquare size={20} className="text-white" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[520px]
                        card flex flex-col shadow-2xl animate-fade-up bg-slate-900/95 backdrop-blur-xl border border-white/10">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/10">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/15 flex items-center justify-center">
              <Bot size={16} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">CityPulse AI</p>
              <p className="text-xs text-white/50">
                {city ? `Context: ${city}` : "No city selected"}
              </p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <Message key={i} msg={msg} />
            ))}
            {loading && (
              <div className="flex gap-2.5 items-center animate-fade-up">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Bot size={13} className="text-white/80" />
                </div>
                <div className="px-3.5 py-2.5 bg-white/5 border border-white/5 rounded-tl-sm flex items-center gap-2 rounded-2xl">
                  <Loader2 size={13} className="animate-spin text-blue-400" />
                  <span className="text-xs text-white/50">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 p-3 border-t border-white/10"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about weather, news..."
              className="input-field h-10 text-xs rounded-xl"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center
                         active:scale-95 transition-all duration-150
                         disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Send size={14} className="text-white" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
