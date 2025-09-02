import { MetadataRoute } from "next";
import { getDocs, collection } from "@firebase/firestore";
import { database } from "@/firebase/firebase";

// ✅ Helper: validate slug format
function isValidSlug(text: string): boolean {
  // only lowercase letters, numbers, and hyphens
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(text);
}

// ✅ Helper: wrap URL
const encodeUrl = (path: string) =>
  `https://amplifyghana.com${encodeURI(path)}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: "https://amplifyghana.com/",
        lastModified: new Date(),
      },
      {
        url: "https://amplifyghana.com/about",
        lastModified: new Date(),
      },
    ];

    // ✅ News pages with valid slugs only
    const newsSnapshot = await getDocs(collection(database, "news"));
    const newsPages: MetadataRoute.Sitemap = newsSnapshot.docs
      .map((doc) => doc.id)
      .filter((id) => isValidSlug(id))
      .map((id) => ({
        url: encodeUrl(`/news/${id}`),
        lastModified: new Date(),
      }));

    // ✅ Editors pages with valid slugs only
    const editorsSnapshot = await getDocs(collection(database, "editors-picks"));
    const editorsPages: MetadataRoute.Sitemap = editorsSnapshot.docs
      .map((doc) => doc.id)
      .filter((id) => isValidSlug(id))
      .map((id) => ({
        url: encodeUrl(`/editors-picks/${id}`),
        lastModified: new Date(),
      }));

    // ✅ Optional: log invalid IDs (helps you track them)
    const invalidNews = newsSnapshot.docs
      .map((doc) => doc.id)
      .filter((id) => !isValidSlug(id));
    const invalidEditors = editorsSnapshot.docs
      .map((doc) => doc.id)
      .filter((id) => !isValidSlug(id));

    if (invalidNews.length || invalidEditors.length) {
      console.warn("⚠️ Skipped invalid slugs:", {
        news: invalidNews,
        editorspicks: invalidEditors,
      });
    }

    // ✅ Return sitemap
    return [...staticPages, ...newsPages, ...editorsPages];
  } catch (error) {
    console.error("Sitemap generation failed:", error);

    // Always return at least home
    return [
      {
        url: "https://amplifyghana.com/",
        lastModified: new Date(),
      },
    ];
  }
}
