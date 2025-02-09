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

    const reader = ollamaResponse.body?.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let responseData = "";

    while (!done) {
      const { value, done: readerDone } = await reader!.read();
      done = readerDone;
      responseData += decoder.decode(value, { stream: true });
    }

    // Now process the responseData, which is in NDJSON format
    const jsonData = responseData.split("\n").map((line) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        return null;
      }
    }).filter(Boolean);  // Filter out any null values

    console.log("Parsed Ollama Response:", jsonData);

    // Check if the last message is 'done' and combine content
    const messageContent = jsonData.map((item) => item?.message?.content).join('');

    if (messageContent) {
      return NextResponse.json({
        message: {
          content: messageContent,
        },
      });
    } else {
      return NextResponse.json({
        error: "Unexpected response format from Ollama",
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Error in API handler:", error);
    return NextResponse.json({ error: "Failed to fetch response from Ollama" }, { status: 500 });
  }
}
