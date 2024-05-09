import React from "react";
import "./Connect.css";
import tiktok_logo from "@/public/tiktok_logo.png";
import instagram_logo from "@/public/instagram_logo.png";
import x_logo from "@/public/x_logo.png";
import email_icon from "@/public/email_icon.png";
import Image from "next/image";

const Connect = () => {
  return (
    <div className="connect-container">
      <div className="connect-header">Follow our Socials</div>

      <div className="connect-socials">
        <div className="connect-social">
          <a
            href="https://www.tiktok.com/@amplify.gh?_t=8iv9u4FSAFi&_r=1"
            target="_blank"
            rel="noreferrer"
            className="connect-social-image"
          >
            <Image
              style={{ width: "auto" }}
              src={tiktok_logo}
              alt="Follow us on TIktok"
              className="tiktok"
            />
          </a>
          <a
            href="https://www.tiktok.com/@amplify.gh?_t=8iv9u4FSAFi&_r=1"
            target="_blank"
            rel="noreferrer"
            className="connect-social-media"
          >
            Follow us on Tiktok @amplify.gh
          </a>
        </div>

        <div className="connect-social">
          <a
            href="https://www.instagram.com/_amplifygh?utm_source=qr"
            target="_blank"
            rel="noreferrer"
            className="connect-social-image"
          >
            <Image
              style={{ width: "auto" }}
              src={instagram_logo}
              alt="Follow us on Instagram"
              className="instagram"
            />
          </a>
          <a
            href="https://www.instagram.com/_amplifygh?utm_source=qr"
            target="_blank"
            rel="noreferrer"
            className="connect-social-media-insta"
          >
            Follow us on Instagram @_amplifygh
          </a>
        </div>

        <div className="connect-social">
          <a
            href="https://x.com/amplifygh?s=21"
            target="_blank"
            rel="noreferrer"
            className="connect-social-image"
          >
            <Image
              style={{ width: "auto" }}
              src={x_logo}
              alt="Follow us on Twitter"
              className="twitter"
            />
          </a>
          <a
            href="https://x.com/amplifygh?s=21"
            target="_blank"
            rel="noreferrer"
            className="connect-social-x"
          >
            Follow us on X @Amplifygh
          </a>
        </div>

        <div className="connect-social">
          <a
            href="mailto:amplifygh@gmail.com?"
            target="_blank"
            rel="noreferrer"
            className="connect-social-image"
          >
            <Image
              style={{ width: "auto" }}
              src={email_icon}
              alt="Send us a mail"
              className="email"
            />
          </a>
          <a
            href="mailto:amplifygh@gmail.com?"
            target="_blank"
            rel="noreferrer"
            className="connect-social-mail"
          >
            Send us an Email on Amplifygh@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Connect;
