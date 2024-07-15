"use client";
import DOMPurify from "isomorphic-dompurify";
import { ShareButton } from "./TArticle";
import { useParams } from "next/navigation";
import * as cheerio from "cheerio";
import LoadingScreen from "@/context/loading/LoadingScreen";
import { Suspense } from "react";
import Image from "next/image";

export default function ArticleContent({ article, featuredAdElements }) {
  const { articleId, category } = useParams();
  const renderFeaturedAd = () => {
    if (featuredAdElements.length > 0) {
      // Render the first featured ad
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
      //   article = JSON.parse(article);
      const sanitizedContent = DOMPurify.sanitize(article.content, {
        ADD_TAGS: ["iframe"],
        ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
      });

      // Parse HTML using cheerio
      const $ = cheerio.load(sanitizedContent);

      // Insert the rendered featured ad into the middle of the article
      const paragraphTags = $("p");
      const middlePosition = Math.floor(paragraphTags.length / 2);

      const renderedFeaturedAd = renderFeaturedAd();

      if (middlePosition >= 0 && renderedFeaturedAd) {
        const targetElement = paragraphTags.eq(middlePosition);
        targetElement.after(renderedFeaturedAd);
        // console.log("Rendered Featured Ad:", renderedFeaturedAd.html());
      }

      $("img").each((index, element) => {
        const altText = $(element).attr("alt");
        if (altText) {
          // Create a container for the image and alt text
          const container = $("<div>")
            .css({
              display: "flex",
              "flex-direction": "column",
            })
            .addClass("image-container");

          // Append the image to the container
          const styledImage = $(element).clone().css({
            margin: "0",
            padding: "0",
          });
          container.append(styledImage);

          // Create a paragraph for the alt text
          const altElement = $("<p>").text(altText).css({
            margin: "0",
            "padding-top": "2px",
            "text-align": "center",
            "font-size": "1.3rem",
            color: "#666666",
            "font-family": "Papyrus, fantasy",
            "font-weight": "200",
          });

          // Append the alt text to the container
          container.append(altElement);

          // Replace the original image with the container
          $(element).replaceWith(container);
        }
      });

      $("iframe").each((index, element) => {
        // Create a container for the iframe
        const container = $("<div>").css({
          display: "flex",
          flexDirection: "column",
        });

        // Append the iframe to the container
        const styledIframe = $(element).clone().css({
          margin: "0",
          padding: "0",
          "max-width": "90vw",
        });
        container.append(styledIframe);

        // Replace the original iframe with the container
        $(element).replaceWith(container);
      });

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

  const modifyLinkTargets = (content) => {
    const $ = cheerio.load(content);

    $("a").attr("target", "_blank");

    return $.html();
  };
  return (
    <>
      {" "}
      <Suspense fallback={<LoadingScreen />}>
        {article && (
          <>
            {/* <Helmet>
              <title>{article.title}- Amplify Ghana</title>
              <meta property="og:image" content={article.image} />
              <meta property="twitter:card" content="summary_large_image" />
              <meta property="twitter:image" content={article.image} />
              <meta property="twitter:title" content={article.title} />
              <meta name="robots" content="index, follow" />
            </Helmet> */}
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
                articleUrl={`article/${category}/${articleId}`}
                articleImageSrc={article.image}
                // className="external-share"
              />
              {renderArticleContent()}
            </div>
          </>
        )}
      </Suspense>
    </>
  );
}
