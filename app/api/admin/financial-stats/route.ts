import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@/payload.config";

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise });
    
    // Auth check for safety, though Payload handles admin dashboard security generally
    // But it's good practice for custom APIs
    const auth = await payload.auth({ headers: req.headers });
    if (!auth?.user || (auth.user.role !== "admin" && auth.user.role !== "publishing_admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calculate overall stats
    const ordersRes = await payload.find({
        collection: "orders",
        where: { status: { equals: "completed" } },
        limit: 5000, 
    });

    let grossRevenue = 0;
    let totalCommission = 0;
    let totalAuthorEarnings = 0;
    let totalSalesCount = ordersRes.docs.length;

    ordersRes.docs.forEach((order: any) => {
        // NGN amount in Paystack is usually stored in full Naira in our Order system
        // because we save formattedAmount to the DB
        grossRevenue += order.amount || 0;
        totalCommission += order.commissionAmount || 0;
        totalAuthorEarnings += order.authorEarnings || 0;
    });

    return NextResponse.json({
        grossRevenue,
        totalCommission,
        totalAuthorEarnings,
        totalSalesCount,
    });
  } catch (error) {
    console.error("Error fetching financial stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
