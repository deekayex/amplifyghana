"use client";
import React from "react";
import DOMPurify from "isomorphic-dompurify";
import { ShareButton } from "./Sharebutton";
import { useParams } from "next/navigation";
import * as cheerio from "cheerio";
import Image from "next/image";

interface Article {
  title: string;
  content: string;
  image: string;
}

interface FeaturedAd {
  link: string;
  imageUrl: string;
}

interface ArticleContentProps {
  article: Article;
  featuredAdElements: FeaturedAd[];
}

export default function ArticleContent({ article, featuredAdElements }: ArticleContentProps) {
  const { articleId, category } = useParams();

  const renderFeaturedAd = () => {
    if (featuredAdElements.length > 0) {
      const ad = featuredAdElements[0];
      const container = cheerio.load("<div></div>")("<div></div>").append(`
        <a href="${ad.link}" target="_blank" rel="noopener noreferrer" class='featured-ad'>
          <img src="${ad.imageUrl}" alt="Featured Ad" class='ad' />
        </a>
      `);
      return container;
    }
    return null;
  };

  const renderArticleContent = () => {
    if (article) {
      const sanitizedContent = DOMPurify.sanitize(article.content, {
        ADD_TAGS: ["iframe"],
        ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
      });

      const $ = cheerio.load(sanitizedContent);
      const paragraphTags = $("p");
      const middlePosition = Math.floor(paragraphTags.length / 2);
      const renderedFeaturedAd = renderFeaturedAd();

      if (middlePosition >= 0 && renderedFeaturedAd) {
        const targetElement = paragraphTags.eq(middlePosition);
        targetElement.after(renderedFeaturedAd);
      }

      return (
        <div className="article-body">
          <div
            dangerouslySetInnerHTML={{ __html: modifyLinkTargets($.html()) }}
          />
        </div>
      );
    }
    return null;
  };

  const modifyLinkTargets = (content: string) => {
    const $ = cheerio.load(content);
    $("a").attr("target", "_blank");
    return $.html();
  };

  return (
    <>
      {article && (
        <>
          <h1 className="article-title">{article.title}</h1>
          <div className="article-image-container">
            <Image
              src={article.image}
              alt="Article"
              className="article-image"
              layout="responsive"
              objectFit="cover"
              width={4000}
              height={100}
            />
          </div>
          <div className="read-article">
            <ShareButton
              articleTitle={article.title}
              articleUrl={`/${category}/${articleId}`}
              articleImageSrc={article.image}
            />
            {renderArticleContent()}
          </div>
        </>
      )}
    </>
  );
}
