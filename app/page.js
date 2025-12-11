import Link from "next/link";

export default function Home() {
  const modules = [
    { name: "Ertis Home", desc: "ЖКХ и счетчики", href: "/ertis-home" },
    { name: "Ertis Safe", desc: "Безопасность и погода", href: "#" },
    { name: "Ertis Law", desc: "Генератор жалоб", href: "#" },
    { name: "Ertis Road", desc: "Дороги и транспорт", href: "#" },
  ];

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Ertis Life AI</h1>
      <p>Экосистема комфортной жизни Павлодара</p>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "20px" }}>
        {modules.map((mod) => (
          <Link key={mod.name} href={mod.href} style={{
            border: "1px solid #ccc",
            borderRadius: "12px",
            padding: "20px",
            width: "200px",
            textAlign: "center",
            textDecoration: "none",
            color: "black"
          }}>
            <h2>{mod.name}</h2>
            <p>{mod.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
