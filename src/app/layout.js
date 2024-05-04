import '../index.css'

export const metadata = {
  title: 'Amplify Ghana | Promoting African Creatives | PR Agency | Music and Entertainment News',
  description: 'Official website for Amplify Ghana. Amplify Ghana is an online platform showcasing African creativity and entertainment, focusing on underground acts and emerging talents. Established in 2020.  Discover the latest Afrobeat, Highlife, Afro-pop, Hip-hop, Trap and more. Join us in amplifying the voices of hidden gems and rising stars in African music and entertainment. Welcome to the heartbeat of African creativity – Amplify Ghana!',
}
 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />        
        <lr-config
          ctx-name="my-uploader"
          pubkey="e08426fbfc2b6705c836"
          maxLocalFileSizeBytes={10000000}
          imgOnly={true}
          sourceList="local, url, dropbox, gdrive"
        ></lr-config>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.cdnfonts.com/css/hanson" rel="stylesheet" />
                    
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Goldman:wght@700&display=swap" rel="stylesheet" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;400;500&display=swap" rel="stylesheet" />

        <link href="https://fonts.cdnfonts.com/css/primetime" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/monument-extended" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
