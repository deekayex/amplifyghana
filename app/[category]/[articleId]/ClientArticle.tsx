"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { database } from "../../../firebase/firebase";
import ArticleContent from "./Article";
import ArticleSide from "../../../components/article/ArticleSide";
import Connect from "../../../components/connect/Connect";
import LoadingScreen from "@/context/loading/LoadingScreen";

type Props = {
  category: string;
  articleId: string;
};



const ClientArticle = ({ category, articleId }: Props) => {
  const [article, setArticle] = useState(null);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const articleRef = doc(database, category, decodeURIComponent(articleId));
        const articleDoc = await getDoc(articleRef);
        if (articleDoc.exists()) {
          setArticle(articleDoc.data());
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    }

    async function fetchAds() {
      try {
        const adsSnapshot = await getDocs(collection(database, "FeaturedAd"));
        if (!adsSnapshot.empty) {
          setAds([adsSnapshot.docs[0].data()]);
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    }

    Promise.all([fetchArticle(), fetchAds()]).then(() => setLoading(false));
  }, [category, articleId]);

  if (loading) return <LoadingScreen/>; // 🟢 Show loading screen while fetching data
  if (!article) return <div>Article Not Found</div>; // 🟠 Handle missing article

  return (
    <div className="article-flex">
      <div className="article-main">
        <ArticleContent article={article} featuredAdElements={ads} />
        <Connect />
      </div>
      <div className="article-aside">
        <ArticleSide />
      </div>
    </div>
  );
};

export default ClientArticle;
