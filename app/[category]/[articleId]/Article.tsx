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

export default function ArticleContent({
  article,
  featuredAdElements,
}: ArticleContentProps) {
  const { articleId, category } = useParams();

  /* ---------------- FEATURED AD ---------------- */
  const renderFeaturedAd = () => {
    if (featuredAdElements.length === 0) return null;

    const ad = featuredAdElements[0];
    const container = cheerio
      .load("<div></div>")("<div></div>")
      .append(`
        <a href="${ad.link}" target="_blank" rel="noopener noreferrer" class="featured-ad">
          <img src="${ad.imageUrl}" alt="Featured advertisement" class="ad" />
        </a>
      `);

    return container;
  };

  /* -------- ENSURE ALL IMAGES HAVE ALT -------- */
  const ensureImageAltText = (content: string, fallbackAlt: string) => {
    const $ = cheerio.load(content);

    $("img").each((_, img) => {
      const alt = $(img).attr("alt");
      if (!alt || alt.trim() === "") {
        $(img).attr("alt", fallbackAlt);
      }
    });

    return $.html();
  };

  /* -------- ADD VISIBLE CAPTIONS -------- */
  const addImageCaptions = (content: string) => {
    const $ = cheerio.load(content);

    $("img").each((_, img) => {

      const $img = $(img);

    // ❌ Skip featured ads
    if (
      $img.hasClass("ad") ||
      $img.closest(".featured-ad").length > 0
    ) {
      return;
    }
    
      const alt = $(img).attr("alt"); 

      if (alt && alt.trim() !== "") {
        if ($(img).parent("figure").length === 0) {
          $(img).wrap('<figure class="article-figure"></figure>');
          $(img).after(
            `<figcaption class="article-caption">${alt}</figcaption>`
          );
        }
      }
    });

    return $.html();
  };

  /* -------- FORCE LINKS TO OPEN IN NEW TAB -------- */
  const modifyLinkTargets = (content: string) => {
    const $ = cheerio.load(content);
    $("a").attr("target", "_blank").attr("rel", "noopener noreferrer");
    return $.html();
  };

  /* -------- RENDER ARTICLE CONTENT -------- */
  const renderArticleContent = () => {
    if (!article) return null;

    const sanitizedContent = DOMPurify.sanitize(article.content, {
      ADD_TAGS: ["iframe", "figure", "figcaption"],
      ADD_ATTR: [
        "allow",
        "allowfullscreen",
        "frameborder",
        "scrolling",
        "src",
        "alt",
        "title",
        "href",
      ],
    });

    const $ = cheerio.load(sanitizedContent);

    const paragraphs = $("p");
    const middleIndex = Math.floor(paragraphs.length / 2);
    const featuredAd = renderFeaturedAd();

    if (featuredAd && middleIndex >= 0) {
      paragraphs.eq(middleIndex).after(featuredAd);
    }

    let html = ensureImageAltText($.html(), article.title);
    html = addImageCaptions(html);
    html = modifyLinkTargets(html);

    return (
      <div className="article-body">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  };

  /* ---------------- MAIN RENDER ---------------- */
  return (
    <>
      {article && (
        <>
          <h1 className="article-title">{article.title}</h1>

          <div className="article-image-container">
            {article.image && (
              <Image
                src={article.image}
                alt={article.title}
                className="article-image"
                layout="responsive"
                objectFit="cover"
                width={4000}
                height={100}
                priority
              />
            )}
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
