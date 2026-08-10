import { database } from "@/firebase/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { cache } from "react";
import type { Metadata } from "next";
import ClientArticle from "./ClientArticle";
import ScrollToTopOnMount from "@/components/ScrollToTop";

type Props = {
  params: Promise<{ category: string; articleId: string }>; // async params
};

type Article = {
  title: string;
  summary: string;
  image: string;
  author: string;
  datePublished: string;
  content: string;
};

const baseUrl = "https://amplifyghana.com";
const defaultShareImage =
  "https://ucarecdn.com/04cd01ca-f483-421d-acad-b64ab26cd7f1/sharelogo.png";

// Utility to serialize Firestore document
function serializeArticle(data: any): Article {
  return {
    title: data.title || "",
    summary: data.summary || "",
    image: data.image || "",
    author: data.author || "Amplify Ghana",
    datePublished: data.datePublished?.toDate
      ? data.datePublished.toDate().toISOString()
      : new Date().toISOString(),
    content: data.content || "",
  };
}

// Cached so generateMetadata and the page component share a single Firestore read per request
const getArticle = cache(async (category: string, articleId: string) => {
  const articleRef = doc(database, category, decodeURIComponent(articleId));
  const articleSnap = await getDoc(articleRef);
  return articleSnap.exists() ? serializeArticle(articleSnap.data()) : null;
});

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, articleId } = await params;
  const article = await getArticle(category, articleId);

  if (!article) {
    return { title: "Article not found | Amplify Ghana" };
  }

  const articleUrl = `${baseUrl}/${category}/${articleId}`;
  const description =
    stripHtml(article.summary || article.content).slice(0, 200) ||
    "Read the latest from Amplify Ghana.";
  const image = article.image || defaultShareImage;

  return {
    title: `${article.title} | Amplify Ghana`,
    description,
    alternates: { canonical: articleUrl },
    openGraph: {
      title: article.title,
      description,
      url: articleUrl,
      type: "article",
      publishedTime: article.datePublished,
      authors: [article.author],
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [image],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { category, articleId } = await params; // unwrap async params

  // Fetch article (cached, shared with generateMetadata) and ads in parallel
  const [article, adsSnap] = await Promise.all([
    getArticle(category, articleId),
    getDocs(collection(database, "FeaturedAd")),
  ]);

  if (!article) {
    return <div>Article not found</div>;
  }

  const ads = !adsSnap.empty ? [adsSnap.docs[0].data()] : [];

  const articleUrl = `${baseUrl}/${category}/${articleId}`;

  return (
    <div className="article-page">
      <ScrollToTopOnMount />
      <div className="spacer" />

      {/* Pass data to client component */}
      <ClientArticle article={article} featuredAdElements={ads} />
    </div>
  );
}
