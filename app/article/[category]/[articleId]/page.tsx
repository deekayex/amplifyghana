import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import ArticleSide from "@/components/article/ArticleSide";
import ScrollToTopOnMount from "@/components/ScrollToTop";
import Connect from "@/components/connect/Connect";
import Share from "@/components/share/Share";
import { database } from "@/firebase/firebase";
import ArticleContent from "@/app/[category]/[articleId]/Article";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";

type Props = {
  params: { category: string; articleId: string };
};
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const article = await fetchArticle(params);

  await fetchData();

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${article.title}- Amplify Ghana`,
    twitter: {
      card: "summary_large_image",
      images: [article.image],
      title: article.title,
    },
    robots: { index: true, follow: true },
    openGraph: {
      images: [article.image, ...previousImages],
    },
  };
}

const ShareButton = ({ articleTitle, articleUrl }) => {
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
const fetchArticle = async (params) => {
  try {
    const { articleId, category } = params;

    const articleRef = doc(database, category, decodeURIComponent(articleId));
    const articleDoc = await getDoc(articleRef);
    // console.log(articleDoc);
    if (articleDoc.exists()) {
      return articleDoc.data();
    } else {
      console.error("Article not found");
    }
  } catch (error) {
    console.error("Error fetching article", error);
    return {};
  } finally {
    setIsLoading(false);
  }
};

const fetchData = async () => {
  try {
    // Fetch FeaturedAd data
    const featuredAdSnapshot = await getDocs(
      collection(database, "FeaturedAd")
    );

    if (!featuredAdSnapshot.empty) {
      // Directly access the data of the first document
      const adData = featuredAdSnapshot.docs[0].data();
      console.log("Fetched FeaturedAd:", adData);

      // Set the single ad data to the state variable
      return [adData];
    } else {
      console.error("No documents found in FeaturedAd collection");
    }

    setIsLoading(false);
  } catch (error) {
    console.error("Error fetching data", error);
    // setIsLoading(false);
  }
};

const Article = async ({ params }: Props) => {
  console.log(params);
  const article = await fetchArticle(params);
  const featuredAdElements = await fetchData();

  return (
    <div className="article-page">
      <ScrollToTopOnMount />
      <div className="spacer" />
        <div className="article-flex">
          <div className="article-main">
            <ArticleContent
              article={JSON.parse(JSON.stringify(article))}
              featuredAdElements={featuredAdElements}
            />

            {/* <Article article={article} {...articleId} {...category} /> */}
            <Connect />
          </div>

          <div className="article-aside">
            <ArticleSide />
          </div>
        </div>
    </div>
  );
};

export default Article;
