"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, CheckCircle } from "lucide-react";
import Header from "../components/Header/page";

export default function ErtisHome() {
  const [image, setImage] = useState(null); // preview
  const [file, setFile] = useState(null);   // выбранный файл
  const [result, setResult] = useState("");

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // очищаем предыдущий preview
    if (image) URL.revokeObjectURL(image);

    setFile(f);
    setImage(URL.createObjectURL(f));
    setResult("");

    // автоматически определяем цифры из имени файла
    const nameWithoutExt = f.name.replace(/\.[^/.]+$/, "");
    const digits = nameWithoutExt.replace(/\D/g, "");
    setResult(digits || "0000");
  };

  const handleClear = () => {
    if (image) URL.revokeObjectURL(image);
    setImage(null);
    setFile(null);
    setResult("");

    const input = document.getElementById("fileInput");
    if (input) input.value = ""; // сброс input для повторного выбора того же файла
  };

  return (
<>
<Header/>
    <div className="max-w-4xl mx-auto p-6 font-sans">
          
      <Link
        href="/"
        className="text-sky-500 mb-4 inline-block hover:underline"
      >
        ← Назад
      </Link>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-sky-100">
        <div className="bg-gradient-to-r from-sky-500 to-cyan-500 p-6 text-white">
          <h1 className="text-2xl font-bold mb-1">Ertis Home — AI сканер счетчиков</h1>
          <p className="text-sky-100 text-sm">Распознаем цифры из имени файла</p>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-sky-300 transition-all"
            />
          </div>

          {image && (
            <div className="text-center">
              <img
                src={image}
                alt="preview"
                className="w-60 mx-auto rounded-xl border border-gray-200"
              />
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleClear}
              disabled={!file}
              className="flex-1 py-3 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Очистить
            </button>
          </div>

          {result && (
            <div className="mt-6 p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50 flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <div className="font-semibold text-emerald-900 text-lg mb-1">
                  Распознанные цифры
                </div>
                <div className="text-gray-700 text-xl font-mono">{result}</div>
                <div className="mt-2 p-2 bg-gray-100 rounded-lg text-gray-700 text-sm">
                  <strong>Готовое сообщение для ЕРЦ:</strong>
                  <p>Показания счетчика: {result}</p>
                </div>
              </div>
            </div>
          )}

          {!result && !image && (
            <div className="mt-4 p-6 text-center text-gray-400 border-2 border-dashed rounded-xl">
              <Camera className="w-12 h-12 mx-auto mb-2" />
              <p>Выберите изображение файла, чтобы распознать цифры</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
