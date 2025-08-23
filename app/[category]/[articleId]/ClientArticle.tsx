"use client";

import ArticleContent from "./Article";
import ArticleSide from "@/components/article/ArticleSide";
import Connect from "@/components/connect/Connect";

interface ClientArticleProps {
  article: any;
  featuredAdElements: any[];
}

const ClientArticle = ({ article, featuredAdElements }: ClientArticleProps) => {
  return (
    <div className="article-flex">
      <div className="article-main">
        <ArticleContent article={article} featuredAdElements={featuredAdElements} />
        <Connect />
      </div>
      <div className="article-aside">
        <ArticleSide />
      </div>
    </div>
  );
};

export default ClientArticle;
