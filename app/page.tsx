"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
  
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
  
    const data = await response.json();
  
    // Check if data.message.content exists before attempting to display it
    const botMessage = data.message?.content
      ? { role: "assistant", content: data.message.content }
      : { role: "assistant", content: "Sorry, I couldn't understand the response." };
  
    setMessages([...messages, userMessage, botMessage]);
    setInput("");
  };
  

  return (
    <div style={{ padding: "20px" }}>
      <h1>ChatGPT Clone</h1>
      <div style={{ border: "1px solid #ccc", padding: "10px", minHeight: "200px" }}>
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.role}:</strong> {msg.content}</p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
