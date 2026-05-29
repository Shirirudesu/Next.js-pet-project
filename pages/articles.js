import Link from "next/link";
import dbConnect from "../lib/dbConnect";
import Article from "../models/Article";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useUser } from "../context/UserContext";

const ArticlesPage = ({ articles }) => {
  const { status, data: session } = useSession();
  const { credits, unlockedArticles, addUnlockedArticleLocal, setCreditsLocal } =
    useUser();
  const [fetchedArticles, setFetchedArticles] = useState(articles);
  const unlockArticle = async (id) => {
    const res = await fetch(`/api/articles/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.user.email,
      }),
    });
    const data = await res.json();
    if (data.success) {
      addUnlockedArticleLocal(id);
      if (typeof data.newCredits === "number") {
        setCreditsLocal(data.newCredits);
      } else {
        setCreditsLocal(Math.max(0, credits - 10));
      }
    } else {
      alert(data.error || "Error");
    }
  };

  const deleteArticle = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this article?");
    if (!confirmed) return;

    const res = await fetch(`/api/articles/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setFetchedArticles((prev) => prev.filter((a) => a._id !== id));
    } else {
      alert("Failed to delete article.");
    }
  };

  return (
    <>
      <div className="grid place-items-center mt-10">
        <h1 className="text-4xl font-bold mb-6">Articles</h1>
        <Link href="/create-article" legacyBehavior>
          <a className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
            Create new Article
          </a>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {fetchedArticles.map((article) => (
          <div
            key={article._id}
            className="border border-gray-300 p-6 rounded-xl shadow-md bg-white"
          >
            <h2 className="text-2xl font-semibold mb-1">{article.title}</h2>
            <p className="text-sm text-gray-500 mb-4">
              📅 {new Date(article.date).toLocaleDateString()}
            </p>
            {unlockedArticles.includes(article._id) ? (
              <>
                <p className="mb-4">{article.body.slice(0, 200)}...</p>
                <div className="flex flex-wrap gap-3">
                  <Link href={`/articles/${article._id}`} legacyBehavior>
                    <a className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
                      View
                    </a>
                  </Link>
                  <Link href={`/articles/${article._id}/edit`} legacyBehavior>
                    <a className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
                      Edit
                    </a>
                  </Link>

                  <button
                    onClick={() => deleteArticle(article._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>

                  <span className="px-4 py-2 bg-gray-200 text-gray-800 rounded">
                    Purchased
                  </span>
                </div>
              </>
            ) : (
              <p className="mb-4 text-gray-500 italic">
                This article is locked. Unlock to view. (Please buy
                article😭🥺🥺)
              </p>
            )}

            {unlockedArticles.includes(article._id) ? (
              <div></div>
            ) : (
              <button
                onClick={() => unlockArticle(article._id)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Buy for 10 credits
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export async function getServerSideProps() {
  await dbConnect();

  const result = await Article.find({});
  const articles = result.map((doc) => {
    const article = doc.toObject();
    article._id = article._id.toString();
    article.date = article.date.toISOString();
    return article;
  });

  return { props: { articles: articles } };
}

export default ArticlesPage;
