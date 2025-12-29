import { database } from "@/firebase/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import ClientArticle from "./ClientArticle";
import ScrollToTopOnMount from "@/components/ScrollToTop";

type Props = {
  params: Promise<{ category: string; articleId: string }>; // async params
};

type Article = {
  title: string;
  summary: string;
  image: string;
  author: string;
  datePublished: string;
  content: string;
};

const baseUrl = "https://amplifyghana.com";

// Utility to serialize Firestore document
function serializeArticle(data: any): Article {
  return {
    title: data.title || "",
    summary: data.summary || "",
    image: data.image || "",
    author: data.author || "Amplify Ghana",
    datePublished: data.datePublished?.toDate
      ? data.datePublished.toDate().toISOString()
      : new Date().toISOString(),
    content: data.content || "",
  };
}

export default async function ArticlePage({ params }: Props) {
  const { category, articleId } = await params; // unwrap async params

  // Fetch article server-side
  const articleRef = doc(database, category, decodeURIComponent(articleId));
  const articleSnap = await getDoc(articleRef);
  const article = articleSnap.exists()
    ? serializeArticle(articleSnap.data())
    : null;

  if (!article) {
    return <div>Article not found</div>;
  }

  // Fetch ads (optional)
  const adsSnap = await getDocs(collection(database, "FeaturedAd"));
  const ads = !adsSnap.empty ? [adsSnap.docs[0].data()] : [];

  const articleUrl = `${baseUrl}/${category}/${articleId}`;

  return (
    <div className="article-page">
      <ScrollToTopOnMount />
      <div className="spacer" />

      {/* Pass data to client component */}
      <ClientArticle article={article} featuredAdElements={ads} />
    </div>
  );
}
