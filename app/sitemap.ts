import { MetadataRoute } from "next";
import { getDocs, collection, addDoc } from "@firebase/firestore";
import { database } from "@/firebase/firebase";

// ✅ Helper: validate slug format
function isValidSlug(text: string): boolean {
  // only lowercase letters, numbers, and hyphens
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(text);
}

// ✅ Helper: wrap URL
const encodeUrl = (path: string) =>
  `https://amplifyghana.com${encodeURI(path)}`;

// ✅ Helper: log invalid slugs into Firestore
async function logInvalidSlugs(type: string, ids: string[]) {
  if (ids.length === 0) return;
  try {
    await addDoc(collection(database, "sitemap-logs"), {
      type,
      invalidSlugs: ids,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("⚠️ Failed to log invalid slugs:", err);
  }
}

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

    // ✅ Collect invalid slugs
    const invalidNews = newsSnapshot.docs
      .map((doc) => doc.id)
      .filter((id) => !isValidSlug(id));
    const invalidEditors = editorsSnapshot.docs
      .map((doc) => doc.id)
      .filter((id) => !isValidSlug(id));

    // ✅ Log invalid slugs into Firestore
    if (invalidNews.length) {
      await logInvalidSlugs("news", invalidNews);
    }
    if (invalidEditors.length) {
      await logInvalidSlugs("editors-picks", invalidEditors);
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
