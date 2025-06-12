import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ArticlePage({ credits, setCredits, boughtItems }) {
  const [unlocked, setUnlocked] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (boughtItems.includes(articleId)) {
      setUnlocked(true);
    }
  }, [boughtItems, articleId]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">
        How to Win at Slot Machines 🎰
      </h1>
      <p className="text-gray-600 mb-2">Your balance: {credits} credits</p>
      <p className="mb-4 text-gray-500">Author: Admin | 📅 25 апреля 2025</p>
      <hr className="mb-6" />

      <div className="prose prose-lg">
        <p>🎯 First step is to control the bet...</p>

        {!boughtItems.includes(articleId) ? (
          <>
            <div className="bg-yellow-100 border border-yellow-300 p-4 rounded mt-6">
              <p className="mb-2 font-semibold">
                🔒 To continue reading, open the article for 10 credits:
              </p>
              <button
                onClick={unlockArticle}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Open completely
              </button>
            </div>
          </>
        ) : (
          <>
            <p>⚠️ Second step is to have fun!</p>
            <p>📌 Remember limits!</p>
            <p>🍀 Good luck and big wins!</p>
          </>
        )}
      </div>
    </div>
  );
}
