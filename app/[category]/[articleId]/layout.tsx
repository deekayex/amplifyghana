import { Metadata } from "next";
import ArticlePage from "./TArticle";

export const metadata: Metadata = {};
import { database } from "@/firebase/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { ReactNode} from "react";


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
    // setIsLoading(false);
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

    // setIsLoading(false);
  } catch (error) {
    console.error("Error fetching data", error);
    // setIsLoading(false);
  }
};

export default async function ArticleLayout({ children, params }: {children: ReactNode, params: { articleId: string, category: string } }) {
  const { articleId, category } = params;

  return (
    <>
      {children}
    </>
  );
}
