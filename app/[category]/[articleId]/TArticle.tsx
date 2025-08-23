import ArticleContent from "./Article";
import ArticleSide from "@/components/article/ArticleSide";
import Connect from "@/components/connect/Connect";
import ScrollToTopOnMount from "@/components/ScrollToTop";

interface Article {
  title: string;
  content: string;
  image: string;
  excerpt?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
}

interface ArticlePageProps {
  params: { articleId: string; category: string };
}

// 🔹 Example fetcher – replace with your Firestore logic
async function getArticle(category: string, articleId: string): Promise<Article | null> {
  // TODO: fetch from Firebase/Firestore here
  return {
    title: "Demo Title",
    content: "Demo content",
    image: "/demo.jpg",
    excerpt: "Demo excerpt",
    author: "Amplify Ghana",
    datePublished: new Date().toISOString(),
  };
}

// ✅ App Router SEO
export async function generateMetadata({ params }: ArticlePageProps) {
  const article = await getArticle(params.category, params.articleId);

  if (!article) {
    return {
      title: "Not Found - Amplify Ghana",
      description: "The requested article could not be found.",
    };
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt || article.title,
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
        url: "https://www.amplifyghana.com/logo.png",
      },
    },
    datePublished: article.datePublished || new Date().toISOString(),
    dateModified: article.dateModified || article.datePublished || new Date().toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.amplifyghana.com/${params.category}/${params.articleId}`,
    },
  };

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
    other: {
      "robots": "index, follow",
      "script:ld+json": JSON.stringify(jsonLd), // ✅ JSON-LD inject
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.category, params.articleId);

  if (!article) return <div>Article not found</div>;

  return (
    <div className="article-page">
      <ScrollToTopOnMount />

      <div className="spacer" />

      <div className="article-flex">
        <div className="article-main">
          <ArticleContent article={article} featuredAdElements={[]} />
          <Connect />
        </div>

        <div className="article-aside">
          <ArticleSide />
        </div>
      </div>
    </div>
  );
}
