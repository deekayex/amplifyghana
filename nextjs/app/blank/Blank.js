import React from "react";
import "./Blank.css";
import Socials from "../../components/socials/Socials";
import Link from "next/link";

const Blank = () => {
  return (
    <div className="blank">
      <p className="blank_error">404</p>
      <p className="blank_message">THE PAGE YOU REQUESTED WAS NOT FOUND</p>
      <div className="links-to-web">
        <Link href="/" className="home-link">
          Go To Home
        </Link>
        <Link href="about" className="about-link">
          Learn About Us
        </Link>
      </div>

      <div className="about_socials">
        <div className="about-us-socials">
          <div className="about-socials">
            <div className="about-social-icon">
              <a
                href="https://www.instagram.com/_amplifygh?utm_source=qr"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={process.env.PUBLIC_URL + "/alt_instagram_logo.png"}
                  alt="Instagram logo"
                  className="about-instagram-logo"
                />
              </a>
            </div>

            <div className="about-social-icon">
              <a
                href="https://www.tiktok.com/@amplify.gh?_t=8iv9u4FSAFi&_r=1"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={process.env.PUBLIC_URL + "/tiktok_logo.png"}
                  alt="Tiktok logo"
                  className="about-tiktok-logo"
                />
              </a>
            </div>
            <div className="about-social-icon">
              <a
                href="https://x.com/amplifygh?s=21"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={process.env.PUBLIC_URL + "/x_logo.png"}
                  alt="X logo"
                  className="about-x-logo"
                />
              </a>
            </div>
            <div className="about-email-icon">
              <a
                href="mailto:amplifygh@gmail.com?"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={process.env.PUBLIC_URL + "/email_icon.png"}
                  alt="Email icon"
                  className="about-email-icon"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blank;
