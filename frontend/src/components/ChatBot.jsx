import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, MessageSquare, X } from "lucide-react";
import { sendChat } from "../services/api";

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"} animate-fade-up`}>
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5
                    ${isUser ? "bg-gold/20 text-gold" : "bg-teal/20 text-teal"}`}
      >
        {isUser ? <User size={13} /> : <Bot size={13} />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                    ${isUser
                      ? "bg-gold/10 text-ink border border-gold/20 rounded-tr-sm"
                      : "bg-surface border border-border text-ink rounded-tl-sm"
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
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const data = await sendChat(input.trim(), city, chatId, updatedMessages);
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
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-13 h-13 w-[52px] h-[52px] rounded-2xl bg-gold
                   flex items-center justify-center shadow-lg shadow-gold/20
                   hover:bg-yellow-300 active:scale-95 transition-all"
      >
        {open ? <X size={20} className="text-bg" /> : <MessageSquare size={20} className="text-bg" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed z-50 card flex flex-col shadow-2xl shadow-black/50 animate-fade-up
                        bottom-0 left-0 right-0 h-[70vh]
                        sm:bottom-24 sm:right-6 sm:left-auto sm:w-96 sm:h-[520px]
                        rounded-t-2xl sm:rounded-2xl">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border">
            <div className="w-8 h-8 rounded-xl bg-teal/20 flex items-center justify-center">
              <Bot size={16} className="text-teal" />
            </div>
            <div>
              <p className="text-sm font-bold text-ink">CityPulse AI</p>
              <p className="text-xs text-muted font-mono">
                {city ? `Context: ${city}` : "No city selected"}
              </p>
            </div> 
            <button onClick={() => setOpen(!open)} className="ml-auto border-2 px-2 rounded-lg border-slate-700">X</button>
            <div className="ml-2 w-2 h-2 rounded-full bg-teal animate-pulse-slow"></div> 
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <Message key={i} msg={msg} />
            ))}
            {loading && (
              <div className="flex gap-2.5 items-center animate-fade-up">
                <div className="w-7 h-7 rounded-lg bg-teal/20 flex items-center justify-center">
                  <Bot size={13} className="text-teal" />
                </div>
                <div className="px-3.5 py-2.5 card rounded-tl-sm flex items-center gap-2">
                  <Loader2 size={13} className="animate-spin text-teal" />
                  <span className="text-xs text-muted font-mono">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 p-3 border-t border-border"
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
              className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center
                         hover:bg-yellow-300 active:scale-95 transition-all
                         disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Send size={14} className="text-bg" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
