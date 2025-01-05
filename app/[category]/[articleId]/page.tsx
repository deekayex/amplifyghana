import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import ArticleSide from "../../../components/article/ArticleSide";
import ScrollToTopOnMount from "../../../components/ScrollToTop";
import Connect from "../../../components/connect/Connect";
import Share from "../../../components/share/Share";
import { database } from "../../../firebase/firebase";
import ArticleContent from "./Article";
import "./ArticlePage.css";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";

type Props = {
  params: { category: string; articleId: string };
};

// Cache for articles and ads
const cache: Record<string, any> = {};

// Fetch article from Firestore
const fetchArticle = async (params) => {
  const { articleId, category } = params;

  if (cache[articleId]) {
    return cache[articleId];
  }

  const articleRef = doc(database, category, decodeURIComponent(articleId));
  const articleDoc = await getDoc(articleRef);

  if (articleDoc.exists()) {
    const articleData = articleDoc.data();
    console.log("Article Title:", articleData.title);
    console.log("Article Image:", articleData.image);
    cache[articleId] = articleData;
    return articleData;
  } else {
    console.error("Article not found");
    return null;
  }
};

// Fetch ads from Firestore
const fetchData = async () => {
  const cacheKey = "featuredAd";
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  const featuredAdSnapshot = await getDocs(collection(database, "FeaturedAd"));
  if (!featuredAdSnapshot.empty) {
    const adData = featuredAdSnapshot.docs[0].data();
    cache[cacheKey] = [adData];
    return cache[cacheKey];
  } else {
    console.error("No documents found in FeaturedAd collection");
    return [];
  }
};

// Metadata for SEO and social link previews
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const article = await fetchArticle(params);

  if (!article) {
    return {
      title: "Article Not Found - Amplify Ghana",
      description: "The article you are looking for does not exist.",
      openGraph: {
        title: "Article Not Found",
        description: "The article you are looking for does not exist.",
        images: ["/default-image.jpg"],
        url: `https://yourdomain.com/${params.category}/${params.articleId}`,
      },
      twitter: {
        card: "summary_large_image",
        title: "Article Not Found",
        description: "The article you are looking for does not exist.",
        images: ["/default-image.jpg"],
      },
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${article.title} - Amplify Ghana`,
    description: article.description || "Read the latest news and updates.",
    openGraph: {
      title: article.title,
      description: article.description,
      images: [article.image, ...previousImages],
      url: `https://aplifyghana.com/${params.category}/${params.articleId}`,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [article.image],
    },
  };
}

// Helper to wrap promises for React Suspense
const wrapPromise = (promise) => {
  let status = "pending";
  let result;
  let suspender = promise.then(
    (res) => {
      status = "success";
      result = res;
    },
    (err) => {
      status = "error";
      result = err;
    }
  );
  return {
    read() {
      if (status === "pending") throw suspender;
      if (status === "error") throw result;
      return result;
    },
  };
};

// Create resources for Suspense
const createResource = (params) => ({
  article: wrapPromise(fetchArticle(params)),
  ads: wrapPromise(fetchData()),
});

// Share Button Component
const ShareButton = ({ articleTitle, articleUrl }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: articleTitle,
          text: "Check out this article!",
          url: articleUrl,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      console.log("Web Share API not supported");
    }
  };

  return (
    <div className="share-container">
      <div className="share-social">
        <Share articleTitle={articleTitle} articleUrl={articleUrl} />
      </div>
      <button className="share-button" onClick={handleShare}>
        <Image
          src={"/share.svg"}
          alt="Share This Article"
          className="share-icon"
          width={100}
          height={100}
        />
      </button>
    </div>
  );
};

// Main Article Page Component
const Article = ({ params }: Props) => {
  const resource = createResource(params);

  return (
    <div className="article-page">
      <ScrollToTopOnMount />
      <div className="spacer" />
      <ArticleContentWrapper resource={resource} />
    </div>
  );
};

// Wrapper Component for Article Content
const ArticleContentWrapper = ({ resource }) => {
  const article = resource.article.read();
  const featuredAdElements = resource.ads.read();

  return (
    <div className="article-flex">
      <div className="article-main">
        <ArticleContent
          article={JSON.parse(JSON.stringify(article))}
          featuredAdElements={featuredAdElements}
        />
        <Connect />
      </div>
      <div className="article-aside">
        <ArticleSide />
      </div>
    </div>
  );
};

export default Article;
