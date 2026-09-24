import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@/payload.config";

const CONTENT_COLLECTIONS = [
  "homily",
  "article",
  "publications",
  "prayer",
  "events",
  "music",
  "magazineIssues",
] as const;

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise });

    const auth = await payload.auth({ headers: req.headers });
    if (!auth?.user || (auth.user.role !== "admin" && auth.user.role !== "publishing_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let totalContentViews = 0;
    const topContent: Array<{
      collection: string;
      id: string | number;
      title: string;
      slug?: string;
      views: number;
    }> = [];

    for (const collection of CONTENT_COLLECTIONS) {
      const result = await payload.find({
        collection,
        sort: "-views",
        limit: 5,
        depth: 0,
        overrideAccess: true,
      });

      for (const doc of result.docs) {
        const views = (doc.views as number) || 0;
        if (views <= 0) continue;
        topContent.push({
          collection,
          id: doc.id,
          title: doc.title || "Untitled",
          slug: doc.slug,
          views,
        });
      }
    }

    // Overall content view totals.
    for (const collection of CONTENT_COLLECTIONS) {
      const result = await payload.find({
        collection,
        limit: 1000,
        depth: 0,
        pagination: false,
        overrideAccess: true,
      });
      for (const doc of result.docs) {
        totalContentViews += (doc.views as number) || 0;
      }
    }

    topContent.sort((a, b) => b.views - a.views);
    const topContentLimited = topContent.slice(0, 10);

    const pagesResult = await payload.find({
      collection: "pageViews",
      sort: "-views",
      limit: 10,
      depth: 0,
      overrideAccess: true,
    });

    const topPages = pagesResult.docs.map((doc) => ({
      path: doc.path,
      title: doc.title,
      views: doc.views || 0,
      lastViewedAt: doc.lastViewedAt,
    }));

    const totalPageViewsResult = await payload.find({
      collection: "pageViews",
      limit: 1000,
      depth: 0,
      pagination: false,
      overrideAccess: true,
    });
    const totalPageViews = totalPageViewsResult.docs.reduce(
      (sum, doc) => sum + (doc.views || 0),
      0,
    );

    return NextResponse.json({
      totals: {
        totalContentViews,
        totalPageViews,
      },
      topContent: topContentLimited,
      topPages,
    });
  } catch (error) {
    console.error("Error fetching analytics stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
