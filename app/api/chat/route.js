import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    // 1. API Кілтін тексеру
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    // 2. Модельді баптау
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `
        Сіз — "Jana Pavlodar AI", Павлодар қаласының ресми ақылды көмекшісісіз.
        Сөйлесу мәнеріңіз: сыпайы, қысқа, нақты және пайдалы.
        Екі тілде (Қазақша, Орысша) сұрауға байланысты жауап беріңіз.
        Егер қолданушы сәлемдессе, қысқаша амандасыңыз.
      `,
    });

    // 3. Соңғы сұрақты алу
    const lastMessage = messages[messages.length - 1];
    const lastMessageContent = lastMessage.content || lastMessage.text;

    // 4. ТАРИХТЫ ТАЗАЛАУ (Ең маңызды бөлік!)
    // Барлық алдыңғы хабарламаларды аламыз
    const previousMessages = messages.slice(0, -1);

    let formattedHistory = previousMessages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content || msg.text }],
    }));

    // ЕРЕЖЕ: Тарих ешқашан 'model'-ден басталмауы керек.
    // Егер бірінші хабарлама AI-дың сәлемдесуі болса, оны тізімнен алып тастаймыз.
    while (formattedHistory.length > 0 && formattedHistory[0].role === "model") {
      formattedHistory.shift(); // Бірінші элементті өшіру
    }

    // 5. Чатты бастау
    const chat = model.startChat({
      history: formattedHistory, // Енді мұнда тек дұрыс тарих бар
    });

    // Хабарлама жіберу
    const result = await chat.sendMessage(lastMessageContent);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });

  } catch (error) {
    console.error("❌ GEMINI ROUTE ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}