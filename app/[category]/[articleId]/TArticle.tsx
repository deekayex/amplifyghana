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


const baseUrl = "https://amplify-ghana.web.app";

// ✅ Generate SEO metadata dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, articleId } = params;

  const articleRef = doc(database, category, decodeURIComponent(articleId));
  const articleSnap = await getDoc(articleRef);
  const article = articleSnap.exists() ? (articleSnap.data() as Article) : null;

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
    article.excerpt?.slice(0, 160) || article.content?.slice(0, 160) || article.title;

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

// ✅ JSON-LD Structured Data for Articles
function ArticleSchema({ article, url }: { article: Article; url: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt || article.content?.slice(0, 150),
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
        url: `${baseUrl}/logo.png`, 
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

// 🔹 Main Page
export default async function ArticlePage({ params }: Props) {
  const { category, articleId } = params;

  // 🟢 Fetch article server-side
  const articleRef = doc(database, category, decodeURIComponent(articleId));
  const articleSnap = await getDoc(articleRef);
  const article = articleSnap.exists() ? (articleSnap.data() as Article) : null;

  // 🟢 Fetch ads server-side
  const adsSnap = await getDocs(collection(database, "FeaturedAd"));
  const ads = !adsSnap.empty ? [adsSnap.docs[0].data()] : [];

  if (!article) {
    return <div>Article not found</div>;
  }

  const articleUrl = `${baseUrl}/${category}/${articleId}`;

  return (
    <div className="article-page">
      <ScrollToTopOnMount />
      <div className="spacer" />

      {/* ✅ Inject SEO structured data for crawlers */}
      <ArticleSchema article={article} url={articleUrl} />

      <ClientArticle article={article} featuredAdElements={ads} />
    </div>
  );
}
