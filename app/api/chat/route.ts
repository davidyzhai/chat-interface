import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const ollamaResponse = await fetch("http://127.0.0.1:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama2",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await ollamaResponse.json();
    
    // Ensure the response includes a 'content' property
    if (data && data.message && data.message.content) {
      return NextResponse.json({
        message: {
          content: data.message.content,
        },
      });
    } else {
      return NextResponse.json({
        error: "Unexpected response format from Ollama",
      }, { status: 500 });
    }

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch response from Ollama" }, { status: 500 });
  }
}
