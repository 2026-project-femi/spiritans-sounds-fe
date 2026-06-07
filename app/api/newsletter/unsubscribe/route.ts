import { getPayload } from "payload";
import configPromise from "@/payload.config";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ message: "Email is required" }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });

    const existingResult = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: email } }
    });

    const subscriber = existingResult.docs[0];

    if (!subscriber) {
      // Don't reveal whether the email exists
      return Response.json({ message: "You have been unsubscribed." }, { status: 200 });
    }

    if (subscriber.status === "unsubscribed") {
      return Response.json({ message: "You have been unsubscribed." }, { status: 200 });
    }

    await payload.update({
      collection: 'subscribers',
      id: subscriber.id,
      data: { status: 'unsubscribed' }
    });

    return Response.json({ message: "You have been unsubscribed." }, { status: 200 });
  } catch (err: any) {
    console.error("Newsletter unsubscribe error:", err);
    return Response.json({ message: "Failed to unsubscribe. Please try again later." }, { status: 500 });
  }
}
