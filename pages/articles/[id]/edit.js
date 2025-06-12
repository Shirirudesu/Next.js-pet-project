import { useRouter } from "next/router";
import Article from "../../../models/Article";
import User from "../../../models/User";
import dbConnect from "../../../lib/dbConnect";
import { getSession } from "next-auth/react";
import { useState } from "react";
const ArticlePage = (props) => {
  const router = useRouter();
  const [title, setTitle] = useState(props.article.title);
  const [body, setBody] = useState(props.article.body);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/articles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body, id: props.article._id }),
      });

      if (res.ok) {
        router.push("/articles");
      } else {
        console.error("Error when creating an article");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Article</h1>

      <label className="block mb-2 font-medium">Title</label>

      <input
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <label className="block mb-2 font-medium">Article Text</label>
      <textarea
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
        }}
        rows={20}
        className="w-full p-3 border border-gray-300 rounded-xl mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
      >
        Submit Button
      </div>
    </div>
  );
};

export default ArticlePage;

export async function getServerSideProps(context) {
  await dbConnect();

  const result = await Article.findById({ _id: context.params.id });

  const article = result.toObject();
  article._id = article._id.toString();
  article.date = article.date.toISOString();
  const session = await getSession(context);
  const user = await User.findOne({ email: session.user.email });
  const userBought = user.unlockedArticles.includes(context.params.id);

  if (!userBought) {
    return {
      redirect: {
        destination: "/articles",
        permanent: false,
      },
    };
  }
  console.log(session);
  return { props: { article: article } };
}
