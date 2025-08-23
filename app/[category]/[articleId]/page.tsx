import { database } from "@/firebase/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import ClientArticle from "./ClientArticle";
import ScrollToTopOnMount from "@/components/ScrollToTop";
import type { Metadata } from "next";

type Props = {
  params: { category: string; articleId: string };
};

type Article = {
  title: string;
  excerpt: string;
  image: string;
  author: string;
  datePublished: string;
  content: string;
};

// 🔹 Called automatically by Next.js at build/runtime for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, articleId } = params;

  const articleRef = doc(database, category, decodeURIComponent(articleId));
  const articleSnap = await getDoc(articleRef);
  const article = articleSnap.exists() ? (articleSnap.data() as Article) : null;

  if (!article) {
    return {
      title: "Article Not Found - Amplify Ghana",
      description: "This article could not be found.",
    };
  }

  return {
    title: `${article.title} - Amplify Ghana`,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      images: [article.image],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || article.title,
      images: [article.image],
    },
    robots: "index, follow",
  };
}

// 🔹 Main Page
export default async function ArticlePage({ params }: Props) {
  const { category, articleId } = params;

  // 🟢 Fetch article server-side
  const articleRef = doc(database, category, decodeURIComponent(articleId));
  const articleSnap = await getDoc(articleRef);
  const article = articleSnap.exists() ? articleSnap.data() : null;

  // 🟢 Fetch ads server-side
  const adsSnap = await getDocs(collection(database, "FeaturedAd"));
  const ads = !adsSnap.empty ? [adsSnap.docs[0].data()] : [];

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div className="article-page">
      <ScrollToTopOnMount />
      <div className="spacer" />
      <ClientArticle article={article} featuredAdElements={ads} />
    </div>
  );
}
