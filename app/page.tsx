"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Append the user message and clear the input
    const newMessage = { role: "user", content: message };
    setChatHistory((prev) => [...prev, newMessage]);
    setMessage("");
    setIsLoading(true);

    // Send message to the API
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    const assistantMessage =
      data.message?.content || "Sorry, I couldn't understand the response.";
    setChatHistory((prev) => [...prev, { role: "assistant", content: assistantMessage }]);
    setIsLoading(false);
  };

  // Auto-scroll to bottom when chatHistory or loading state changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow py-4">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-white">ChatGPT</h1>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-6">
        <div
          ref={chatContainerRef}
          className="flex flex-col space-y-4 overflow-y-auto h-[calc(100vh-160px)]"
        >
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-xl p-4 max-w-md text-sm shadow-sm transition-all duration-300 ${
                  msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-xl p-4 max-w-md bg-gray-700 text-gray-300">Typing…</div>
            </div>
          )}
        </div>
      </main>

      {/* Input area */}
      <footer className="bg-gray-800 py-4 shadow">
        <div className="max-w-3xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message ChatGPT"
              className="flex-grow p-4 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none"
              disabled={isLoading}
            >
              Send
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
