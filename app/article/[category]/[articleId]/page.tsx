import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import ArticleSide from "@/components/ArticleSide";
import ScrollToTopOnMount from "@/components/ScrollToTop";
import Connect from "@/components/connect/Connect";
import Share from "@/components/share/Share";
import { database } from "@/firebase/firebase";
import ArticleContent from "@/app/[category]/[articleId]/Article";
// import "@/app/[articleId]/ArticlePage.css";
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
export const fetchArticle = async (params) => {
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
    // setIsLoading(false);
  }
};

export const fetchData = async () => {
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

    // setIsLoading(false);
  } catch (error) {
    console.error("Error fetching data", error);
    // setIsLoading(false);
  }
};

const Article = async ({ params }: Props) => {
  console.log(params);
  // console.log(article);

  // const [article, setArticle] = useState(null);
  const article = await fetchArticle(params);
  // const [isLoading, setIsLoading] = useState(true);
  // const location = useLocation();
  // const ad = location.state?.ad;
  // const [featuredAdElements, setFeaturedAdElements] = useState([]);
  const featuredAdElements = await fetchData();

  // useEffect(() => {
  //   const fetchArticle = async () => {
  //     try {
  //       console.log(articleId, "articleId now");
  //       const articleRef = doc(
  //         database,
  //         category,
  //         decodeURIComponent(articleId)
  //       );
  //       const articleDoc = await getDoc(articleRef);
  //       console.log(articleDoc.data());
  //       if (articleDoc.exists()) {
  //         setArticle(articleDoc.data());
  //       } else {
  //         console.error("Article not found");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching article", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchArticle();
  // }, [category, articleId]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Fetch FeaturedAd data
  //       const featuredAdSnapshot = await getDocs(
  //         collection(database, "FeaturedAd")
  //       );

  //       if (!featuredAdSnapshot.empty) {
  //         // Directly access the data of the first document
  //         const adData = featuredAdSnapshot.docs[0].data();
  //         console.log("Fetched FeaturedAd:", adData);

  //         // Set the single ad data to the state variable
  //         setFeaturedAdElements([adData]);
  //       } else {
  //         console.error("No documents found in FeaturedAd collection");
  //       }

  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching data", error);
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // const renderFeaturedAd = () => {
  //   if (featuredAdElements.length > 0) {
  //     // Render the first featured ad
  //     const ad = featuredAdElements[0];

  //     const container = document.createElement("div");
  //     container.innerHTML = `
  //       <a href="${ad.link}" target="_blank" rel="noopener noreferrer" class='featured-ad'>
  //         <img src="${ad.imageUrl}" alt="Featured Ad" class='ad' />
  //       </a>
  //     `;

  //     return container;
  //   }

  //   return null;
  // };

  // const renderArticleContent = () => {
  //   if (article) {
  //     const sanitizedContent = DOMPurify.sanitize(article.content, {
  //       ADD_TAGS: ["iframe"],
  //       ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
  //     });

  //     const parser = new DOMParser();
  //     const doc = parser.parseFromString(sanitizedContent, "text/html");

  //     // Insert the rendered featured ad into the middle of the article
  //     const paragraphTags = doc.querySelectorAll("p");
  //     const middlePosition = Math.floor(paragraphTags.length / 2);

  //     const renderedFeaturedAd = renderFeaturedAd();

  //     if (middlePosition >= 0 && renderedFeaturedAd) {
  //       const targetElement = paragraphTags[middlePosition];
  //       targetElement.insertAdjacentElement("afterend", renderedFeaturedAd);
  //       console.log("Rendered Featured Ad:", renderedFeaturedAd);
  //     }

  //     doc.querySelectorAll("img").forEach((image) => {
  //       const altText = image.getAttribute("alt");
  //       if (altText) {
  //         // Create a container for the image and alt text
  //         const container = document.createElement("div");
  //         container.style.display = "flex";
  //         container.style.flexDirection = "column";
  //         // container.style.backgroundColor = 'green'
  //         container.className = "image-container";

  //         // Append the image to the container
  //         const styledImage = image.cloneNode(true);
  //         styledImage.style.margin = "0";
  //         styledImage.style.padding = "0";
  //         // styledImage.style.marginBottom = '10px';

  //         container.appendChild(styledImage);

  //         // Create a paragraph for the alt text
  //         const altElement = document.createElement("p");
  //         altElement.textContent = altText;

  //         // Add styles for flexbox layout
  //         altElement.style.margin = "0"; // Set margin to zero
  //         altElement.style.paddingTop = "2px";
  //         // altElement.style.backgroundColor = 'blue';
  //         altElement.style.textAlign = "center";
  //         altElement.style.fontSize = "1.3rem";
  //         altElement.style.color = "#666666";
  //         altElement.style.fontFamily = "Papyrus, fantasy";
  //         altElement.style.fontWeight = "200";

  //         // Append the alt text to the container
  //         container.appendChild(altElement);

  //         // Replace the original image with the container
  //         image.parentNode.replaceChild(container, image);
  //       }
  //     });

  //     doc.querySelectorAll("iframe").forEach((iframe) => {
  //       // Create a container for the iframe
  //       const container = document.createElement("div");
  //       container.style.display = "flex";
  //       container.style.flexDirection = "column";
  //       // Add additional styles as needed

  //       // Append the iframe to the container
  //       const styledIframe = iframe.cloneNode(true);
  //       // Apply styles to the iframe as needed
  //       styledIframe.style.margin = "0";
  //       styledIframe.style.padding = "0";
  //       styledIframe.style.maxWidth = "90vw";

  //       container.appendChild(styledIframe);

  //       // Replace the original iframe with the container
  //       iframe.parentNode.replaceChild(container, iframe);
  //     });

  //     return (
  //       <div className="article-body">
  //         <div
  //           dangerouslySetInnerHTML={{
  //             __html: modifyLinkTargets(doc.body.innerHTML),
  //           }}
  //         />
  //       </div>
  //     );
  //   }

  //   return null;
  // };

  // const modifyLinkTargets = (content) => {
  //   const parser = new DOMParser();
  //   const doc = parser.parseFromString(content, "text/html");

  //   doc.querySelectorAll("a").forEach((link) => {
  //     link.setAttribute("target", "_blank");
  //   });

  //   return doc.body.innerHTML;
  // };

  return (
    <div className="article-page">
      <ScrollToTopOnMount />
      <div className="spacer" />
      {/* {isLoading ? (
        <LoadingScreen />
      ) : ( */}

      <Suspense fallback={<LoadingScreen />}>
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
        {/* )}{" "} */}
      </Suspense>
    </div>
  );
};

export default Article;
