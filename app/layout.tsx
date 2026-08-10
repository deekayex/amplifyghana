import localFont from "next/font/local";
import "./globals.css";
// import { Analytics } from "@vercel/analytics/react";
// import { SpeedInsights } from "@vercel/speed-insights/react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer/Footer";

import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// const inter = Inter({ subsets: ["latin"] });
const goldman = localFont({
  src: [
    { path: "./fonts/Goldman-Regular.ttf", weight: "400" },
    { path: "./fonts/Goldman-Bold.ttf", weight: "700" }
  ],
  variable: "--font-goldman",
  display: "swap"
});

export const metadata: Metadata = {
  title:
    "Amplify Ghana | Promoting African Creatives | PR Agency | Music and\
  Entertainment News",
  description:
    "Amplify Ghana is an Online Creative’s Promotion and Public Relations Agency Founded in 2020. Our Primary Mission is to Elevate Creatives Throughout Africa, With a Special Focus on Ghana, As that is Where We are Headquartered.",
  openGraph: {
    images:
      "https://ucarecdn.com/04cd01ca-f483-421d-acad-b64ab26cd7f1/sharelogo.png",
  },
};
export default function RootLayout({ children }) {
  return (
    // <html lang="en" className={goldman.className}>
    <html lang="en" className={goldman.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;400;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Goldman:wght@700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.cdnfonts.com/css/monument-extended"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        <main className="site-main">{children}</main>
        <Footer />
      </body>
     
      {/* <Analytics />
      <SpeedInsights /> */}
    </html>
  );
}
