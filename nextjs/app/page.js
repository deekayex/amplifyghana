"use client";
import React, { lazy, Suspense } from "react";
import "./HomePages.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Socials from "../components/socials/Socials";
import Home from "../components/Home";
import LoadingHome from "../context/loading/HomeLoad/LoadingHome";
import dynamic from "next/dynamic";

const News = dynamic(() => import("../components/news/News"));
const EditorsPicks = dynamic(() => import("../components/editors-picks/page"));

// export const metadata = {
//   title:
//     "Amplify Ghana | Promoting African Creatives | PR Agency | Music and\
//   Entertainment News",
//   description:
//     "Amplify Ghana is an Online Creative’s Promotion and Public Relations Agency Founded in 2020. Our Primary Mission is to Elevate Creatives Throughout Africa, With a Special Focus on Ghana, As that is Where We are Headquartered.",
// };
function HomePages() {
  return (
    <div className="container" id="home">
      {/* <Helmet>
        <title>
          Amplify Ghana | Promoting African Creatives | PR Agency | Music and
          Entertainment News
        </title>
        <meta
          name="description"
          content="Amplify Ghana is an Online Creative’s Promotion and Public Relations Agency Founded in 2020. Our Primary Mission is to Elevate Creatives Throughout Africa, With a Special Focus on Ghana, As that is Where We are Headquartered."
        />
        <meta
          property="og:image"
          content="https://ucarecdn.com/04cd01ca-f483-421d-acad-b64ab26cd7f1/sharelogo.png"
        />
      </Helmet> */}
      <div>
        <div className="home-page">
          <div className="space" />
          <div className="home-menu-icons">
            <div className="home-icon">
              <HomeOutlinedIcon fontSize="10rem" className="home_icon" />
              HOME
            </div>
            <div className="home-socials">
              <Socials />
            </div>
          </div>
          <Suspense fallback={<LoadingHome />}>
            <Home />
          </Suspense>
          <Suspense fallback={<LoadingHome />}>
            <News />
          </Suspense>
          <Suspense fallback={<LoadingHome />}>
            <EditorsPicks />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default HomePages;
