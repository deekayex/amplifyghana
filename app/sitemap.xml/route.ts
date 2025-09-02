import { NextResponse } from "next/server";
import { getDocs, collection } from "@firebase/firestore";
import { database } from "@/firebase/firebase";

// Helper
function isValidSlug(text: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(text);
}

export const dynamic = "force-dynamic"; // ✅ Required for Firestore fetch

export async function GET() {
  try {
    // Fetch Firestore docs
    const newsSnapshot = await getDocs(collection(database, "news"));
    const editorSnapshot = await getDocs(collection(database, "editors-picks"));

    const urls = [
      "https://amplifyghana.com/",
      "https://amplifyghana.com/about",
      ...newsSnapshot.docs
        .map((doc) => doc.id)
        .filter(isValidSlug)
        .map((id) => `https://amplifyghana.com/news/${id}`),
      ...editorSnapshot.docs
        .map((doc) => doc.id)
        .filter(isValidSlug)
        .map((id) => `https://amplifyghana.com/editors-picks/${id}`),
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls
        .map(
          (url) => `
        <url>
          <loc>${url}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
        </url>`
        )
        .join("")}
    </urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (err) {
    console.error("❌ Sitemap generation failed:", err);

    // fallback: at least serve homepage
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://amplifyghana.com/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
    </urlset>`;

    return new NextResponse(fallback, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }
}
