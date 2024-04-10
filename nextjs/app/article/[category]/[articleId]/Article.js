import DOMPurify from "dompurify";
import { ShareButton } from "./page";

export default function Article({ article }) {
  const renderFeaturedAd = () => {
    if (featuredAdElements.length > 0) {
      // Render the first featured ad
      const ad = featuredAdElements[0];

      const container = document.createElement("div");
      container.innerHTML = `
        <a href="${ad.link}" target="_blank" rel="noopener noreferrer" class='featured-ad'>
          <img src="${ad.imageUrl}" alt="Featured Ad" class='ad' />
        </a>
      `;

      return container;
    }

    return null;
  };

  const renderArticleContent = () => {
    const sanitizedContent = DOMPurify.sanitize(article.content, {
      ADD_TAGS: ["iframe"],
      ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
    });

    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizedContent, "text/html");

    // Insert the rendered featured ad into the middle of the article
    const paragraphTags = doc.querySelectorAll("p");
    const middlePosition = Math.floor(paragraphTags.length / 2);

    const renderedFeaturedAd = renderFeaturedAd();

    if (middlePosition >= 0 && renderedFeaturedAd) {
      const targetElement = paragraphTags[middlePosition];
      targetElement.insertAdjacentElement("afterend", renderedFeaturedAd);
      console.log("Rendered Featured Ad:", renderedFeaturedAd);
    }

    doc.querySelectorAll("img").forEach((image) => {
      const altText = image.getAttribute("alt");
      if (altText) {
        // Create a container for the image and alt text
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.flexDirection = "column";
        // container.style.backgroundColor = 'green'
        container.className = "image-container";

        // Append the image to the container
        const styledImage = image.cloneNode(true);
        styledImage.style.margin = "0";
        styledImage.style.padding = "0";
        // styledImage.style.marginBottom = '10px';

        container.appendChild(styledImage);

        // Create a paragraph for the alt text
        const altElement = document.createElement("p");
        altElement.textContent = altText;

        // Add styles for flexbox layout
        altElement.style.margin = "0"; // Set margin to zero
        altElement.style.paddingTop = "2px";
        // altElement.style.backgroundColor = 'blue';
        altElement.style.textAlign = "center";
        altElement.style.fontSize = "1.3rem";
        altElement.style.color = "#666666";
        altElement.style.fontFamily = "Papyrus, fantasy";
        altElement.style.fontWeight = "200";

        // Append the alt text to the container
        container.appendChild(altElement);

        // Replace the original image with the container
        image.parentNode.replaceChild(container, image);
      }
    });

    doc.querySelectorAll("iframe").forEach((iframe) => {
      // Create a container for the iframe
      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.flexDirection = "column";
      // Add additional styles as needed

      // Append the iframe to the container
      const styledIframe = iframe.cloneNode(true);
      // Apply styles to the iframe as needed
      styledIframe.style.margin = "0";
      styledIframe.style.padding = "0";
      styledIframe.style.maxWidth = "90vw";

      container.appendChild(styledIframe);

      // Replace the original iframe with the container
      iframe.parentNode.replaceChild(container, iframe);
    });

    return (
      <div className="article-body">
        <div
          dangerouslySetInnerHTML={{
            __html: modifyLinkTargets(doc.body.innerHTML),
          }}
        />
      </div>
    );

    return null;
  };

  const modifyLinkTargets = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    doc.querySelectorAll("a").forEach((link) => {
      link.setAttribute("target", "_blank");
    });

    return doc.body.innerHTML;
  };
  return (
    article && (
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
          <img src={article.image} alt="Article" className="article-image" />
        </div>
        <div className="read-article">
          {/* <ShareButton
            articleTitle={article.title}
            articleUrl={`/article/${category}/${articleId}`}
            articleImageSrc={article.image}
            className="external-share"
          /> */}
          {renderArticleContent()}
        </div>
      </>
    )
  );
}
