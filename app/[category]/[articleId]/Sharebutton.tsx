"use client";
import React from "react";
import Image from "next/image";
import Share from "@/components/share/Share";
import'./ArticlePage.css'

interface ShareButtonProps {
  articleTitle: string;
  articleUrl: string;
  articleImageSrc: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  articleTitle,
  articleUrl,
  articleImageSrc,
}) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: articleTitle,
          text: "Check out this article!",
          url: articleUrl,
        });
      } catch (error) {
        console.error("Error sharing", error);
      }
    }
  };

  return (
    <div className="share-container">
      <div className="share-social">
        <Share articleTitle={articleTitle} articleUrl={articleUrl} />
      </div>
      <button className="share-button" onClick={handleShare}>
        <Image
          src={"/share.svg"}
          alt="Share This Article"
          className="share-icon"
          width={32}
          height={32}
        />
      </button>
    </div>
  );
};
