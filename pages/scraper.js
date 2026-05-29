import { useState } from "react";
import { useSession } from "next-auth/react";
import { useUser } from "../context/UserContext";

export default function ScraperPage() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const { credits, setCreditsLocal } = useUser();

  const handleScrape = async () => {
    if (credits < 5) {
      alert("Not enough credits to scrape. Need at least 5.");
      return;
    }

    setLoading(true);
    setData(null);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, email: session?.user?.email }),
      });
      const result = await res.json();
      setData(result);
      if (typeof result?.credits === "number") {
        setCreditsLocal(result.credits);
      }
    } catch (err) {
      console.error("Ошибка при парсинге:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Web Scraper</h1>

      <p className="text-center text-lg">
        Balance: <span className="font-semibold">{credits}</span> credits
      </p>
      <br></br>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste link, example: https://www.delfi.lt"
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleScrape}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading || credits < 5}
      >
        {loading ? "Loading..." : "Scraping"}
      </button>

      {credits < 5 && (
        <p className="text-red-600 mt-2 font-medium">
          Not enough credits to scrape. Minimum required: 5.
        </p>
      )}

      {data && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            Title: {data.title || "—"}
          </h2>
          <p className="text-lg leading-relaxed mt-4">
            <strong>Text (first paragraph):</strong> {data.text || "—"}
          </p>

          {data.publishDate && (
            <p className="text-gray-600 mt-2">Published: {data.publishDate}</p>
          )}

          {data.img && (
            <img
              src={data.img.startsWith("http") ? data.img : `https:${data.img}`}
              alt="Scraped"
              className="mt-2 max-w-full rounded"
            />
          )}

          {data.links?.length > 0 && (
            <ul className="list-disc ml-6 mt-4">
              {data.links.slice(0, 10).map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline break-all"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
