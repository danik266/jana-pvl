"use client";

import { useState } from "react";
import Link from "next/link";

export default function ErtisHome() {
  const [image, setImage] = useState(null); // preview
  const [file, setFile] = useState(null);   // выбранный файл
  const [result, setResult] = useState("");

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setFile(f);
    setImage(URL.createObjectURL(f));
    setResult("");

    // автоматически определяем цифры из имени файла
    const nameWithoutExt = f.name.replace(/\.[^/.]+$/, ""); // убираем расширение
    const digits = nameWithoutExt.replace(/\D/g, ""); // оставляем только цифры
    setResult(digits || "0000"); // если цифр нет, "0000"
  };

  const handleClear = () => {
    if (image) URL.revokeObjectURL(image);
    setImage(null);
    setFile(null);
    setResult("");
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <Link href="/">← Назад</Link>
      <h1>Ertis Home — AI сканер счетчиков (по имени файла)</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ marginTop: 20 }}
      />

      {image && (
        <img
          src={image}
          alt="preview"
          style={{ width: 300, marginTop: 20, borderRadius: 8, border: "1px solid #ccc" }}
        />
      )}

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button
          onClick={handleClear}
          disabled={!file}
          style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #aaa" }}
        >
          Очистить
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Распознанные цифры:</h2>
          <p style={{ fontSize: 24, fontWeight: "bold" }}>{result}</p>

          <div style={{ marginTop: 10, background: "#f0f0f0", padding: 10, borderRadius: 6 }}>
            <strong>Готовое сообщение для ЕРЦ:</strong>
            <p>Показания счетчика: {result}</p>
          </div>
        </div>
      )}
    </div>
  );
}
