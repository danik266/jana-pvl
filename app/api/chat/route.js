import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    // 1. Проверка API ключа
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

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
      systemInstruction: `
        Ты — "Jana Pavlodar AI", официальный умный помощник города Павлодар.

        ТВОИ ИНСТРУКЦИИ:
        1. Язык ответа: Всегда отвечай на том же языке, на котором написал пользователь (если пишут на русском — отвечай на русском, если на казахском — на казахском).
        2. Форматирование: СТРОГО ЗАПРЕЩЕНО использовать звездочки (** или *), решетки (#) и любое Markdown-форматирование. Пиши ответ только обычным, чистым текстом.
        3. Стиль: Будь вежливым, кратким, конкретным и полезным. Не лей воду.
        4. Приветствие: Если пользователь просто здоровается, поздоровайся кратко в ответ.
      `,
    });

    // 3. Получение последнего сообщения
    const lastMessage = messages[messages.length - 1];
    const lastMessageContent = lastMessage.content || lastMessage.text;

    // 4. Очистка и форматирование истории чата
    const previousMessages = messages.slice(0, -1);

    let formattedHistory = previousMessages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content || msg.text }],
    }));

    // Удаляем сообщения модели из начала списка, если они там есть (правило API)
    while (formattedHistory.length > 0 && formattedHistory[0].role === "model") {
      formattedHistory.shift();
    }

    // 5. Запуск чата
    const chat = model.startChat({
      history: formattedHistory,
    });

    // Отправка сообщения
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