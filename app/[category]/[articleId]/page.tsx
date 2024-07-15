import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import ArticleSide from "../../../components/ArticleSide";
import ScrollToTopOnMount from "../../../components/ScrollToTop";
import Connect from "../../../components/connect/Connect";
import Share from "../../../components/share/Share";
import { database } from "../../../firebase/firebase";
import ArticleContent from "./Article";
import "./ArticlePage.css";
import { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import LoadingScreen from "@/context/loading/LoadingScreen";

type Props = {
  params: { category: string; articleId: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const article = await fetchArticle(params);

  const featuredAdElements = await fetchData();

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${article?.title}- Amplify Ghana`,
    twitter: {
      card: "summary_large_image",
      images: [article?.image],
      title: article?.title,
    },
    robots: { index: true, follow: true },
    openGraph: {
      images: [article?.image, ...previousImages],
    },
  };
}

export const ShareButton = ({ articleTitle, articleUrl, articleImageSrc }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: articleTitle,
          text: "Check out this article!",
          url: articleUrl,
          // image: articleImageSrc,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      console.log("Web Share API not supported");
    }
  };

  return (
    <div className="share-container">
      {/* <Helmet>
        <title>{articleTitle}- Amplify Ghana</title>
        <meta property="og:image" content={articleImageSrc} />
        <meta name="description" content={articleTitle} />
      </Helmet> */}
      <div className="share-social">
        <Share articleTitle={articleTitle} articleUrl={articleUrl} />
      </div>
      <button className="share-button" onClick={handleShare}>
        <img
          src={"/share.svg"}
          alt="Share This Article"
          className="share-icon"
        />
      </button>
    </div>
  );
};

// Create a cache for the articles and ads
const cache = {};

const fetchArticle = async (params) => {
  const { articleId, category } = params;

  if (cache[articleId]) {
    return cache[articleId];
  }

  const articleRef = doc(database, category, decodeURIComponent(articleId));
  const articleDoc = await getDoc(articleRef);
  if (articleDoc.exists()) {
    cache[articleId] = articleDoc.data();
    return cache[articleId];
  } else {
    console.error("Article not found");
    return null;
  }
};

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
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    }
  };
};

const createResource = (params) => {
  return {
    article: wrapPromise(fetchArticle(params)),
    ads: wrapPromise(fetchData())
  };
};

const Article = ({ params }: Props) => {
  const resource = createResource(params);

  return (
    <div className="article-page">
      <ScrollToTopOnMount />
      <div className="spacer" />
      <Suspense fallback={<LoadingScreen />}>
        <ArticleContentWrapper resource={resource} />
      </Suspense>
    </div>
  );
};

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
