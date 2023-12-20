import React, { useState } from 'react';


const BoxContainer = () => {
  const boxTexts = [
    [
    { header: 'PUBLIC RELATIONS', body: 'AMPLIFY GHANA’S PR SERVICES ARE DESIGNED TO HELP BRANDS MAINTAIN A POSITIVE PUBLIC IMAGE AND INFORM THE GENERAL PUBLIC ABOUT NEW DEVELOP-MENTS WITHIN THEIR CAMP. WE DO THIS BY CRAFTING COMPELLING PRESS RELEASES AND SECURING FEATURES ON VARIOUS REPUTABLE WESBITES.' },
    { header: 'MUSIC PITCHING', body: 'TAILORED PRIMARILY TO MUSIC ARTISTS, OUR MUSIC PITCHING SERVICE INVOLVES SECURING INCLUSION IN CURATED PLAYLISTS ON APPLE MUSIC, SPOTIFY, ETC (INCLUDING EDITORIAL PLAYLISTS). WE ALSO EXTEND OUR EFFORTS TO GARNER SUBSTANTIAL SOCIAL SUPPORT FOR YOUR MUSIC RELEASES.' },
    { header: 'CREATIVE DIRECTION', body: 'UNDER OUR CREATIVE DIRECTION SERVICE WE TAKE ON THE ROLE OF GUIDING AND SHAPING THE CREATIVE ELEMENTS OF YOUR PROJECT. THIS INCLUDES BUT NOT LIMITED TO : DESIGNING COVER ARTS FOR MUSIC RELEASES, DIRECTING + EDITING VIDEOS, DESIGNING MERCHANDISE, ETC.' },
  ],

  [
  { header: 'ELECTRONIC PRESS KITS (EPKs)', body: 'ELEVATE YOUR ARTIST PROFILE WITH OUR EXPERTLY DESIGNED ELECTRONIC PRESS KITS. OUR EPKs ARE CRAFTED TO CAPTIVATE INDUSTRY HEADS & MUSIC EXECUTIVES, ENSURING ARTISTS STANDOUT IN A COMPETITIVE LANDSCAPE.' },
  { header: 'CONTENT CREATION', body: 'ENGAGE WITH YOUR AUDIENCE LIKE NEVERBEFORE THROUGH OUR BULK SMS CAMPAIGN SERVICE. WITH A CONTACT BOOK BOASTING OVER 1000+ CONTACTS, WE  EMPOWER YOU TO DIRECTLY REACH YOUR AUDIENCE’S MOBILE DEVICES WITH TARGETED MESSAGES. WHETHER YOU’RE PROMOTING A BRAND, LAUNCHING A NEW PRODUCT OR UNVEILING YOUR EP, OUR BULK SMS CAMPAIGN SERVICE GUARANTEES A HIGH SUCCESS RATE.' },
  { header: 'TIMES SQUARE DIGITAL BILLBOARD SPACE', body: 'GAIN UNPARALLELED VISIBILITY WITH OUR EXCLUSIVE SERVICE THAT PUTS YOU IN THE SPOTLIGHT AT TIMES SQUARE, NEW YORK CITY. WE CAN SECURE DIGITAL BILLBOARD SPACES TO SHOWCASE YOUR BRAND, MUSICAL RELEASE,OR ANY PROMOTIONAL CONTENT, MAKING A STATEMENT ON ONE OF THE WORLD’S MOST ICONIC ADVERTISING PLATFORMS.' },
 ]
];

  const [currentBoxSet, setCurrentBoxSet] = useState(0);

  const handleNextBoxSet = () => {
    setCurrentBoxSet(1); // Set to the second set
  };

  const handlePreviousBoxSet = () => {
    setCurrentBoxSet(0); // Set to the first set
  };

  return (
    <div className="box_container">

      <div className="box_controls">
        <div
          onClick={handlePreviousBoxSet}
          className={`previous-button ${currentBoxSet === 0 ? 'disabled' : ''}`}
        >
          <span>&#10094;</span>
        </div>
      </div>

      <div className="box_text">
        {boxTexts[currentBoxSet].map((boxData, index) => (
          <div key={index} className={`box_${index + 1}`}>
            <div className="box_text_header">{boxData.header}</div>
            <div className="box_text_body">{boxData.body}</div>
          </div>
        ))}
      </div>

      <div className="box_controls">
        <div
          onClick={handleNextBoxSet}
          className={`next-button ${currentBoxSet === 1 ? 'disabled' : ''}`}
        >
          <span>&#10095;</span>
        </div>
      </div>
     </div>
  );
};

export default BoxContainer;
