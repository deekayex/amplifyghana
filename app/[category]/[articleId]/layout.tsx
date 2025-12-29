import { ReactNode } from "react";
import { database } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ articleId: string; category: string }>; // params can be async
}

export default async function ArticleLayout({ children, params }: LayoutProps) {
  const { articleId, category } = await params; // unwrap the async params

  // Optional: Fetch data globally for the layout (e.g., Featured Ads)
  const featuredAds: any[] = [];
  try {
    const adsSnap = await getDocs(collection(database, "FeaturedAd"));
    if (!adsSnap.empty) {
      featuredAds.push(adsSnap.docs[0].data());
    }
  } catch (error) {
    console.error("Error fetching FeaturedAd in layout:", error);
  }

  return (
    <>
      {/* You could pass `featuredAds` as context or props if needed */}
      {children}
    </>
  );
}
