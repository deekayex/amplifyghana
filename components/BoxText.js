"use client"
import React, { useState, useEffect } from "react";

const BoxContainer = () => {
  const boxTexts = [
    {
      header: "PUBLIC RELATIONS",
      body: "AMPLIFY GHANA’S PR SERVICES ARE DESIGNED TO HELP BRANDS MAINTAIN A POSITIVE PUBLIC IMAGE AND INFORM THE GENERAL PUBLIC ABOUT NEW DEVELOPMENTS WITHIN THEIR CAMP. WE DO THIS BY CRAFTING COMPELLING PRESS RELEASES AND SECURING FEATURES ON VARIOUS REPUTABLE WEBSITES.",
    },
    {
      header: "MUSIC PITCHING",
      body: "TAILORED PRIMARILY TO MUSIC ARTISTS, OUR MUSIC PITCHING SERVICE INVOLVES SECURING INCLUSION IN CURATED PLAYLISTS ON APPLE MUSIC, SPOTIFY, ETC (INCLUDING EDITORIAL PLAYLISTS). WE ALSO EXTEND OUR EFFORTS TO GARNER SUBSTANTIAL SOCIAL SUPPORT FOR YOUR MUSIC RELEASES.",
    },
    {
      header: "CREATIVE DIRECTION",
      body: "UNDER OUR CREATIVE DIRECTION SERVICE WE TAKE ON THE ROLE OF GUIDING AND SHAPING THE CREATIVE ELEMENTS OF YOUR PROJECT. THIS INCLUDES BUT NOT LIMITED TO: DESIGNING COVER ARTS FOR MUSIC RELEASES, DIRECTING + EDITING VIDEOS, DESIGNING MERCHANDISE, ETC.",
    },
    {
      header: "ELECTRONIC PRESS KITS (EPKs)",
      body: "ELEVATE YOUR ARTIST PROFILE WITH OUR EXPERTLY DESIGNED ELECTRONIC PRESS KITS. OUR EPKs ARE CRAFTED TO CAPTIVATE INDUSTRY HEADS & MUSIC EXECUTIVES, ENSURING ARTISTS STAND OUT IN A COMPETITIVE LANDSCAPE.",
    },
    {
      header: "BULK SMS",
      body: "ENGAGE WITH YOUR AUDIENCE LIKE NEVER BEFORE THROUGH OUR BULK SMS CAMPAIGN SERVICE. WITH A CONTACT BOOK BOASTING OVER 1000+ CONTACTS, WE EMPOWER YOU TO DIRECTLY REACH YOUR AUDIENCE’S MOBILE DEVICES WITH TARGETED MESSAGES. WHETHER YOU’RE PROMOTING A BRAND, LAUNCHING A NEW PRODUCT, OR UNVEILING YOUR EP, OUR BULK SMS CAMPAIGN SERVICE GUARANTEES A HIGH SUCCESS RATE.",
    },
    {
      header: "TIMES SQUARE DIGITAL BILLBOARD SPACE",
      body: "GAIN UNPARALLELED VISIBILITY WITH OUR EXCLUSIVE SERVICE THAT PUTS YOU IN THE SPOTLIGHT AT TIMES SQUARE, NEW YORK CITY. WE CAN SECURE DIGITAL BILLBOARD SPACES TO SHOWCASE YOUR BRAND, MUSICAL RELEASE, OR ANY PROMOTIONAL CONTENT, MAKING A STATEMENT ON ONE OF THE WORLD’S MOST ICONIC ADVERTISING PLATFORMS.",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [screenWidth, setScreenWidth] = useState(0); // Default value, will be set later
  const [boxesPerPage, setBoxesPerPage] = useState(3); // Default to show 3 boxes per page

  useEffect(() => {
    // Function to update screenWidth and set initial boxesPerPage
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add event listener for window resize
    if (typeof window !== "undefined") {
      setScreenWidth(window.innerWidth); // Set initial screenWidth
      window.addEventListener("resize", handleResize); // Add resize event listener

      // Cleanup function to remove event listener on component unmount
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  // Update boxesPerPage based on screenWidth
  useEffect(() => {
    if (screenWidth < 700) {
      setBoxesPerPage(2); // Show 2 boxes per page for screens smaller than 700px
    } else {
      setBoxesPerPage(3); // Show 3 boxes per page for screens larger than or equal to 700px
    }
  }, [screenWidth]);

  const totalPages = Math.ceil(boxTexts.length / boxesPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const startIndex = (currentPage - 1) * boxesPerPage;
  const endIndex = startIndex + boxesPerPage;
  const currentBoxes = boxTexts.slice(startIndex, endIndex);

  return (
    <div className="box_container">
      {/* Box Text */}
      <div className="box_text">
        {currentBoxes.map((boxData, index) => (
          <div key={index} className={`box_${index + 1}`}>
            <h2 className="box_text_header">{boxData.header}</h2>
            <p className="box_text_body">{boxData.body}</p>
          </div>
        ))}
      </div>

      {/* Box Controls */}
      <div className="box_controls">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="previous-button"
          style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
        >
          <span>&#10094;</span>
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="next-button"
          style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
        >
          <span>&#10095;</span>
        </button>
      </div>
    </div>
  );
};

export default BoxContainer;
