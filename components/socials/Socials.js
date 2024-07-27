import React from "react";
import "./Socials.css";
import tiktok_logo from "/public/tiktok_logo.png";
import instagram_logo from "/public/instagram_logo.png";
import x_logo from "/public/x_logo.png";
import email_icon from "/public/email_icon.png";
import Image from "next/image";

const Socials = () => {
  return (
    <div className="socials">
      <div className="social-icon">
        <a
          href="https://www.instagram.com/_amplifygh?utm_source=qr"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src={instagram_logo}
            alt="Instagram logo"
            className="instagram-logo"
            style={{ width: "15px", height: "15px" }}
            width={100}
            height={100}
          />
        </a>
      </div>

      <div className="social-icon">
        <a
          href="https://www.tiktok.com/@amplify.gh?_t=8iv9u4FSAFi&_r=1"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src={tiktok_logo}
            alt="Tiktok logo"
            className="tiktok-logo"
            style={{ width: "15px", height: "15px" }}
            width={100}
            height={100}
          />
        </a>
      </div>
      <div className="social-icon">
        <a href="https://x.com/amplifygh?s=21" target="_blank" rel="noreferrer">
          <Image
            src={x_logo}
            alt="X logo"
            className="x-logo"
            style={{ width: "15px", height: "15px" }}
            width={100}
            height={100}
          />
        </a>
      </div>
      <div className="social-icon">
        <a href="mailto:amplifygh@gmail.com?" target="_blank" rel="noreferrer">
          <Image
            src={email_icon}
            alt="Email icon"
            className="email-icon"
            style={{ width: "15px", height: "15px" }}
            width={100}
            height={100}
          />
        </a>
      </div>
    </div>
  );
};

export default Socials;
