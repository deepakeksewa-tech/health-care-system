import React, { useState, useRef, useEffect } from "react";

const LOGO_URL = "	https://health-care-system-sooty.vercel.app/assets/Logo-9xxjUAgH.png";
const API_URL ="http://127.0.0.1:8000/chat";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Namaste! Main MedSewa AI hoon. Doctor, specialization ya appointment ke baare mein poochiye.",
      recommendations: [],
      disclaimer: "",
    },
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg =
          typeof data?.detail === "string"
            ? data.detail
            : data?.detail?.[0]?.msg || `Request failed (${res.status})`;
        throw new Error(errMsg);
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.answer || "Koi jawab nahi mila.",
          recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
          disclaimer: data.disclaimer || "",
        },
      ]);
    } catch (err) {
      console.error("MedSewa AI error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: err.message || "Backend se connect nahi ho pa raha. Kripya dobara try karein.",
          recommendations: [],
          disclaimer: "",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 h-[460px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#058b7c] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={LOGO_URL}
                alt="MedSewa AI"
                className="w-7 h-7 rounded-full object-cover bg-white p-0.5"
              />
              <div>
                <div className="font-semibold text-sm leading-tight">MedSewa AI</div>
                <div className="text-[11px] text-emerald-100">Doctor & Care Assistant</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="text-white/80 hover:text-white text-base leading-none cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50 text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-end gap-2 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <img
                    src={LOGO_URL}
                    alt="Bot"
                    className="w-6 h-6 rounded-full object-cover border border-gray-200 bg-white shrink-0"
                  />
                )}

                <div
                  className={`px-3.5 py-2.5 rounded-2xl max-w-[82%] whitespace-pre-wrap break-words ${
                    msg.sender === "user"
                      ? "bg-[#058b7c] text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-2xs"
                  }`}
                >
                  <div>{msg.text}</div>

                  {msg.sender === "bot" && msg.recommendations?.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="text-[11px] font-semibold text-[#058b7c] mb-1">
                        Recommended:
                      </div>
                      <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5">
                        {msg.recommendations.map((rec, rIdx) => (
                          <li key={rIdx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {msg.sender === "bot" && msg.disclaimer && (
                    <div className="mt-2 pt-1.5 border-t border-gray-100 text-[10px] text-gray-400 leading-snug">
                      {msg.disclaimer}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-gray-400 italic pl-8">
                MedSewa AI thinking...
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the Question..."
              disabled={loading}
              className="flex-1 text-sm text-gray-800 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-[#058b7c]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-[#058b7c] text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-95 disabled:opacity-50 cursor-pointer"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle chatbot"
        className="ml-auto flex items-center justify-center w-14 h-14 rounded-full bg-[#058b7c] text-white shadow-lg hover:scale-105 active:scale-95 transition-transform overflow-hidden p-1 cursor-pointer"
      >
        {isOpen ? (
          <span className="text-xl leading-none">✕</span>
        ) : (
          <img
            src={LOGO_URL}
            alt="Open Chat"
            className="w-full h-full rounded-full object-cover bg-white"
          />
        )}
      </button>
    </div>
  );
};

export default ChatWidget;