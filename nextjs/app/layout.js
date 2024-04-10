import { Goldman } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Navbar from "@/components/navbar";

// const inter = Inter({ subsets: ["latin"] });
const goldman = Goldman({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title:
    "Amplify Ghana | Promoting African Creatives | PR Agency | Music and\
  Entertainment News",
  description:
    "Amplify Ghana is an Online Creative’s Promotion and Public Relations Agency Founded in 2020. Our Primary Mission is to Elevate Creatives Throughout Africa, With a Special Focus on Ghana, As that is Where We are Headquartered.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={goldman.className}>
      <body>
        <Navbar />
        {children}
      </body>
      <Analytics />
      <SpeedInsights />
    </html>
  );
}
