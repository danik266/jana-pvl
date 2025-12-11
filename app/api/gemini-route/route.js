import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { interests, lang } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Используем самую актуальную модель
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Ты — туристический гид по Павлодару.
      Интересы: ${interests.join(", ")}.
      Язык ответа: ${lang}.
      
      Создай маршрут. Верни ТОЛЬКО валидный JSON (без markdown, без слова json в начале) с такой структурой:
      {
        "title": "Название маршрута",
        "points": [
          { "title": "Место", "desc": "Описание (1 предложение)" }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Чистим ответ от markdown
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
        const json = JSON.parse(text);
        return NextResponse.json(json);
    } catch (parseError) {
        console.error("AI вернул не JSON:", text);
        return NextResponse.json({ error: "AI Error: Invalid JSON" }, { status: 500 });
    }

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message }, 
      { status: 500 }
    );
  }
}