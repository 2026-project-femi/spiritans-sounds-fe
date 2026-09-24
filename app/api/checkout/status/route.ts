import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@/payload.config";

/**
 * Returns the server-side status of an order so the completion page can verify
 * a payment instead of trusting URL parameters. Only non-PII fields are exposed.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  try {
    const payloadCms = await getPayload({ config: configPromise });
    const order = await payloadCms.findByID({
      collection: "orders",
      id: orderId,
      depth: 0,
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        status: order.status,
        format: order.format,
        isPreorder: order.isPreorder,
        fulfillmentStatus: order.fulfillmentStatus,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
}
