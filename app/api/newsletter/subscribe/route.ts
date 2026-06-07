import { getPayload } from "payload";
import configPromise from "@/payload.config";

export async function POST(req: Request) {
  try {
    const { email, firstName } = await req.json();

    if (!email) {
      return Response.json({ message: "Email is required" }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });

    // Check if user is already subscribed
    const existingResult = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: email } }
    });

    const existingSubscriber = existingResult.docs[0];

    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return Response.json({ message: "You are already subscribed!" }, { status: 200 });
      } else {
        // Reactivate subscription
        await payload.update({
          collection: 'subscribers',
          id: existingSubscriber.id,
          data: { status: 'active' }
        });
        return Response.json({ message: "Welcome back! Your subscription is reactivated." }, { status: 200 });
      }
    }

    await payload.create({
      collection: 'subscribers',
      data: {
        email,
        firstName: firstName ? firstName.trim() : undefined,
        status: 'active'
      }
    });

    return Response.json({ message: "Successfully subscribed to our newsletter!" }, { status: 200 });
  } catch (err: any) {
    console.error("Newsletter subscription error:", err);
    return Response.json({ message: "Failed to subscribe. Please try again later." }, { status: 500 });
  }
}
