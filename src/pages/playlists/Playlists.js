import React from 'react';
import './Playlists.css';

function PlaylistComponent({ imageSrc, altText, description, buttonText }) {
  return (
    <div className='playlist_component'>
      <div className='playlist_image'>
        <img src={process.env.PUBLIC_URL + imageSrc} alt={altText} className='picture' />
      </div>
      <div className='playlist_text'>
        {description}
        <button className='playlist_button'>{buttonText}</button>
      </div>
    </div>
  );
}

function Playlists() {
  const playlistsData = [
    {
      imageSrc: '/MusicFriday.png',
      altText: 'New Music Friday',
      description: 'DISCOVER NEW AFRICAN MUSIC WITH OUR "NEW MUSIC FRIDAY" PLAYLIST. OUR EXPERTLY CRAFTED SELECTION CUTS THROUGH THE OVERWHELMING VOLUME OF RELEASES, PRESENTING ONLY THE BEST TRACKS THAT DEFINE  THE PULSE OF AFRICAN MUSIC. THIS PLAYLIST IS UPDATED WEEKLY, IF YOU LIKE SOMETHING YOU           HEAR WE RECOMMEND YOU ADD IT TO YOUR LIBRARY.',
      buttonText: 'LISTEN',
    },

    {
      imageSrc: '/DeyTrap.png',
      altText: 'New Music Friday',
      description: '"WE DEY TRAP" IS AN INTRODUCTION TO THE MINDS OF THE NEW GENERATION OF GHANAIAN RAPPERS AND TRAPPERS. FROM THE BUSTLE OF OSU TO THE TRENCHES IN KUMERICA AND BEYOND, THIS PLAYLIST EMBODIES THE HEART AND SPIRIT OF THE STREET. LISTEN WITH CAUTION, AND IF YOU HEAR SOMETHING YOU LIKE, WE RECOMMEND ADDING IT TO  YOUR LIBRARY.',
      buttonText: 'LISTEN',
    },

    {
      imageSrc: '/MamasDay.png',
      altText: 'New Music Friday',
      description: '“A MOTHER’S LOVE FOR HER CHILD IS LIKE NOTHING ELSE IN THE WORLD. IT KNOWS NO LAW, NO PITY” - AGATHA CHRISTIE. WE PRESENT TO YOU TEN GHANAIAN SONGS THAT YOU CAN USE TO CELEBRATE YOUR MOTHERS ON MOTHER’S DAY. THIS IS “MAMA’S DAY”.',
      buttonText: 'LISTEN',
    },

    {
      imageSrc: '/Picks.png',
      altText: 'New Music Friday',
      description: 'WHERE EACH TRACK CARRIES THE ESSENCE OF HIS ARTISTIC VISION, ’KIRANI AYAT’S PICKS’ IS A PLAYLIST CURATED BY THE AWARD-WINNING MUSICIAN HIMSELF. FEATURING SOME OF HIS BIGGEST HITS LIKE ’SARKI’ AND ’INA JIN,’ ALONGSIDE MUSIC ROM FREQUENT COLLABORATORS AND FELLOW ARTISTES, ’KIRANI AYAT’S PICKS’ IS A CURATED JOURNEY THROUGH THE ARTIST’S MUSICAL LANDSCAPE. IF YOU HEAR SOMETHING  THAT RESONATES WITH YOU, WE RECOMMEND ADDING IT TO YOUR LIBRARY.',
      buttonText: 'LISTEN',
    },

    {
      imageSrc: '/TopSongs.png',
      altText: 'New Music Friday',
      description: "EMBARK ON A MUSICAL TIME CAPSULE WITH 'TOP SONGS OF 2021,' WHERE WE PROUDLY PRESENT OUR FAVORITE GHANAIAN TRACKS THAT DEFINED THE YEAR. IMMERSE YOURSELF IN CHART-TOPPING HITS LIKE BLACK SHERIF'S 'SECOND SERMON (REMIX)' AND DARKOVIBES' 'JE M'APPELLE,' TO HIDDEN GEMS FROM EMERGING ARTISTS THAT MAY HAVE FLOWN UNDER THE RADAR BUT ARE EQUALLY EXTRAORDINARY. THESE SONGS, RANGING FROM THE MOST POPULAR TO THE UNDISCOVERED, ENCAPSULATE THE DIVERSE SOUNDSCAPE OF GHANAIAN MUSIC IN 2021. AS YOU LISTEN,WE INVITE YOU TO EXPERIENCE THE SAME EXHILARATION AND EMOTION THAT THESE TRACKS BROUGHT TO US THROUGHOUT THE YEAR.",
      buttonText: 'LISTEN',
    },

    // Add data for other playlists
  ];

  return (
    <div className='playlist-page'>
      <div className='playlist-header'>Playlists</div>
      <div className='playlist-container'>
        {playlistsData.map((playlist, index) => (
          <PlaylistComponent key={index} {...playlist} />
        ))}
      </div>
    </div>
  );
}

export default Playlists;





//         <div className='playlist_component'>
//           <div className='playlist_image'>
//           <img src={process.env.PUBLIC_URL + '/TopSongs.png'} alt='New Music Friday' className='picture'/>
//           </div>
      
//           <div className='playlist_text'>
//           EMBARK ON A MUSICAL TIME CAPSULE WITH 'TOP SONGS OF 2021,' WHERE 
//           WE PROUDLY PRESENT OUR FAVORITE GHANAIAN TRACKS THAT DEFINED 
//           THE YEAR. IMMERSE YOURSELF IN CHART-TOPPING HITS LIKE BLACK 
//           SHERIF'S 'SECOND SERMON (REMIX)' AND DARKOVIBES' 'JE M'APPELLE,' TO 
//           HIDDEN GEMS FROM EMERGING ARTISTS THAT MAY HAVE FLOWN UNDER THE 
//           RADAR BUT ARE EQUALLY EXTRAORDINARY. THESE SONGS, RANGING FROM 
//           THE MOST POPULAR TO THE UNDISCOVERED, ENCAPSULATE THE DIVERSE 
//           SOUNDSCAPE OF GHANAIAN MUSIC IN 2021. AS YOU LISTEN,WE INVITE YOU TO 
//           EXPERIENCE THE SAME EXHILARATION AND EMOTION THAT THESE TRACKS 
//           BROUGHT TO US THROUGHOUT THE YEAR.
//             <button className='playlist_button'>LISTEN</button>    
//           </div>    
//         </div>
//         </div>
//       </div>
//   )
// }

// export default Playlists