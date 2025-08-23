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
  summary: string;
  image: string;
  author: string;
  datePublished: string; // ISO string
  content: string;
};

// 🔹 Base domain (replace with your production domain if different)
const baseUrl = "https://amplifyghana.com";

/* -------------------------------------------------
   ✅ Generate SEO Metadata Dynamically
-------------------------------------------------- */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, articleId } = params;

  // Decode the Firestore-safe ID
  const articleRef = doc(database, category, decodeURIComponent(articleId));
  const articleSnap = await getDoc(articleRef);

  const article = articleSnap.exists()
    ? serializeArticle(articleSnap.data())
    : null;

  if (!article) {
    return {
      title: "Article Not Found - Amplify Ghana",
      description: "This article could not be found.",
      robots: "noindex, nofollow",
    };
  }

  const articleUrl = `${baseUrl}/${category}/${articleId}`;
  const imageUrl = article.image?.startsWith("http")
    ? article.image
    : `${baseUrl}${article.image}`;

  const description =
    article.summary?.slice(0, 160) ||
    article.content?.slice(0, 160) ||
    article.title;

  return {
    title: `${article.title} - Amplify Ghana`,
    description,
    openGraph: {
      title: article.title,
      description,
      url: articleUrl,
      images: [{ url: imageUrl }],
      type: "article",
      siteName: "Amplify Ghana",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: articleUrl,
    },
    robots: "index, follow",
  };
}

/* -------------------------------------------------
   ✅ Serialize Firestore Document
-------------------------------------------------- */
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

/* -------------------------------------------------
   ✅ JSON-LD Structured Data for SEO
-------------------------------------------------- */
function ArticleSchema({ article, url }: { article: Article; url: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary || article.content?.slice(0, 150),
    image: [article.image],
    author: {
      "@type": "Person",
      name: article.author || "Amplify Ghana",
    },
    publisher: {
      "@type": "Organization",
      name: "Amplify Ghana",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/favicon.ico`,
      },
    },
    datePublished: article.datePublished,
    dateModified: article.datePublished,
    mainEntityOfPage: url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* -------------------------------------------------
   🔹 Main Page Component
-------------------------------------------------- */
export default async function ArticlePage({ params }: Props) {
  const { category, articleId } = params;

  // 🟢 Fetch article server-side
  const articleRef = doc(database, category, decodeURIComponent(articleId));
  const articleSnap = await getDoc(articleRef);
  const article = articleSnap.exists()
    ? serializeArticle(articleSnap.data())
    : null;

  // 🟢 Fetch ads (only first ad shown for now)
  const adsSnap = await getDocs(collection(database, "FeaturedAd"));
  const ads = adsSnap.empty ? [] : [adsSnap.docs[0].data()];

  if (!article) {
    return <div>Article not found</div>;
  }

  const articleUrl = `${baseUrl}/${category}/${articleId}`;

  return (
    <div className="article-page">
      <ScrollToTopOnMount />
      <div className="spacer" />

      {/* ✅ SEO structured data for crawlers */}
      <ArticleSchema article={article} url={articleUrl} />

      {/* ✅ Pass serialized data to client component */}
      <ClientArticle article={article} featuredAdElements={ads} />
    </div>
  );
}
