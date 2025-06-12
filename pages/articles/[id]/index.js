import { useRouter } from "next/router";
import Article from "../../../models/Article";
import User from "../../../models/User";
import dbConnect from "../../../lib/dbConnect";
import { getSession } from "next-auth/react";

const ArticlePage = (props) => {
  return (
    <div>
      {props.article.title} <div> {props.article.body}</div>
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
