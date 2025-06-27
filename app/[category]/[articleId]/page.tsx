import ScrollToTopOnMount from "../../../components/ScrollToTop";
import ClientArticle from "./ClientArticle";
import { Metadata } from "next";
import { doc, getDoc } from "firebase/firestore";
import { database } from "../../../firebase/firebase";

type Props = {
  params: { category: string; articleId: string };
};

// Fetch metadata for Open Graph preview
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, articleId } = params;
  const articleRef = doc(database, category, decodeURIComponent(articleId));
  const articleDoc = await getDoc(articleRef);

  if (!articleDoc.exists()) {
    return {
      title: "Article Not Found - My Website",
      description: "The article you are looking for does not exist.",
      openGraph: {
        title: "Article Not Found",
        description: "The article you are looking for does not exist.",
        images: ["/default-thumbnail.jpg"],
<<<<<<< HEAD
        url: `https://amplifyghana.com/news/${category}/${articleId}`,
=======
        url: `https://mywebsite.com/news/${category}/${articleId}`,
>>>>>>> a01724bb8ae2e78ae0646862e816360def73b6de
      },
      twitter: {
        card: "summary_large_image",
        title: "Article Not Found",
        description: "The article you are looking for does not exist.",
        images: ["/default-thumbnail.jpg"],
      },
    };
  }

  const article = articleDoc.data();

  return {
    title: `${article.title} | Amplify Ghana`,
<<<<<<< HEAD
    description: article.summary || "Read the latest news and articles here!",
    openGraph: {
      title: article.title,
      description: article.summary || "Read the latest news and articles here!",
      images: [article.image || "/default-thumbnail.jpg"],
      url: `https://www.amplifyghana.com/${category}/${articleId}`,
=======
    description: article.description || "Read the latest news and articles here!",
    openGraph: {
      title: article.title,
      description: article.description || "Read the latest news and articles here!",
      images: [article.image || "/default-thumbnail.jpg"],
      url: `https://mywebsite.com/news/${category}/${articleId}`,
>>>>>>> a01724bb8ae2e78ae0646862e816360def73b6de
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
<<<<<<< HEAD
      description: article.summary || "Check out this article!",
=======
      description: article.description || "Check out this article!",
>>>>>>> a01724bb8ae2e78ae0646862e816360def73b6de
      images: [article.image || "/default-thumbnail.jpg"],
    },
  };
}

const Article = ({ params }: Props) => {
  return (
    <div className="article-page">
      <ScrollToTopOnMount />
      <div className="spacer" />
      <ClientArticle category={params.category} articleId={params.articleId} />
    </div>
  );
};

export default Article;
