"use server";

import { database } from "@/firebase/firebase";
import { collection, doc, getDoc, getDocs } from "@firebase/firestore";

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
