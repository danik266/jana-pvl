"use client";

import { useState } from "react";
import Header from "./../components/Header/page";
import { Search, MapPin, Tag, Navigation, Frown, Loader2 } from "lucide-react";

// --- MOCK DATA ТОЛЬКО ВЕЩИ ---
const MOCK_PRODUCTS = [
  {
    id: 1,
    store: "SportMaster",
    product: "Кроссовки Nike Air",
    category: "обувь кроссовки спорт",
    discount: "-30%",
    oldPrice: "45 000 ₸",
    newPrice: "31 500 ₸",
    distance: "500 м",
    address: "ул. Сатпаева 15",
    color: "bg-blue-50",
  },
  {
    id: 2,
    store: "Adidas Pavlodar",
    product: "Беговые кроссовки",
    category: "обувь кроссовки бег",
    discount: "-15%",
    oldPrice: "30 000 ₸",
    newPrice: "25 500 ₸",
    distance: "1.2 км",
    address: "ТЦ Batyr Mall",
    color: "bg-gray-50",
  },
  {
    id: 3,
    store: "Kimex",
    product: "Зимние ботинки",
    category: "обувь ботинки зима",
    discount: "-50%",
    oldPrice: "60 000 ₸",
    newPrice: "30 000 ₸",
    distance: "2.4 км",
    address: "ул. Торайгырова 72",
    color: "bg-red-50",
  },
  {
    id: 4,
    store: "Technodom",
    product: "iPhone 13 Case",
    category: "электроника аксессуары",
    discount: "-70%",
    oldPrice: "5 000 ₸",
    newPrice: "1 500 ₸",
    distance: "800 м",
    address: "ул. Кутузова 44",
    color: "bg-yellow-50",
  },
];

export default function ErtisRoadPage() {
  const [currentLang, setCurrentLang] = useState("kz");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const filtered = MOCK_PRODUCTS.filter(
        (item) =>
          item.product.toLowerCase().includes(lowerQuery) ||
          item.category.toLowerCase().includes(lowerQuery) ||
          item.store.toLowerCase().includes(lowerQuery)
      );
      setResults(filtered);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header
        currentLanguage={currentLang}
        onLanguageChange={setCurrentLang}
        onBackToHome={() => {}}
        onAuthChange={() => {}}
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-12 animate-fadeIn">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#419181] mb-3 text-center">
            Ertis Road Search
          </h1>
          <p className="text-gray-500 mb-6 text-center max-w-lg mx-auto">
            Введите название вещи (например:{" "}
            <span className="font-semibold text-gray-700">"кроссовки"</span>),
            чтобы найти ближайшие магазины со скидками.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-32 py-4 bg-white border border-gray-200 rounded-2xl leading-5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#419181] focus:border-transparent shadow-sm transition-all text-lg text-black"
              placeholder="Что ищем? (кроссовки, ботинки, аксессуары...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-[#419181] hover:bg-[#367a6d] text-white px-6 rounded-xl font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Найти
            </button>
          </form>
        </div>

        <div className="min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center pt-10 opacity-70">
              <Loader2 className="w-10 h-10 animate-spin text-[#419181] mb-2" />
              <p className="text-sm text-gray-500">Ищем лучшие предложения...</p>
            </div>
          ) : (
            <>
              {hasSearched && results.length === 0 && (
                <div className="flex flex-col items-center justify-center pt-10 text-gray-400">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Frown className="w-10 h-10 opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600">Ничего не найдено</h3>
                  <p>Попробуйте изменить запрос.</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    <div
                      className={`px-5 py-3 ${item.color} border-b border-gray-100 flex justify-between items-center`}
                    >
                      <span className="font-bold text-gray-700 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#419181]" />
                        {item.store}
                      </span>
                      <span className="bg-white/80 text-gray-600 text-xs px-2 py-1 rounded-md font-medium border border-gray-200">
                        {item.distance}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-800 leading-tight group-hover:text-[#419181] transition-colors">
                          {item.product}
                        </h3>
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                          {item.discount}
                        </span>
                      </div>

                      <div className="mt-auto pt-4">
                        <div className="flex items-end gap-2 mb-4">
                          <span className="text-2xl font-bold text-[#419181]">
                            {item.newPrice}
                          </span>
                          <span className="text-sm text-gray-400 line-through mb-1">
                            {item.oldPrice}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="truncate max-w-[120px]">{item.address}</span>
                          </div>

                          <button className="flex items-center text-sm font-semibold text-[#419181] hover:text-[#2d665b] transition-colors">
                            Маршрут <Navigation className="w-3 h-3 ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
