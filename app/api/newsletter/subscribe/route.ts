import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export async function POST(req: Request) {
  try {
    const { email, firstName } = await req.json();

    if (!email) {
      return Response.json({ message: "Email is required" }, { status: 400 });
    }

    const token = process.env.SANITY_API_TOKEN;
    
    if (!token) {
      console.error("Missing SANITY_API_TOKEN in environment variables");
      return Response.json({ message: "Server configuration error" }, { status: 500 });
    }

    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token,
    });

    // Check if user is already subscribed
    const existingSubscriber = await client.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email }
    );

    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return Response.json({ message: "You are already subscribed!" }, { status: 200 });
      } else {
        // Reactivate subscription
        await client
          .patch(existingSubscriber._id)
          .set({ status: 'active', subscribedAt: new Date().toISOString() })
          .commit();
        return Response.json({ message: "Welcome back! Your subscription is reactivated." }, { status: 200 });
      }
    }

    await client.create({
      _type: "subscriber",
      ...(firstName ? { firstName: firstName.trim() } : {}),
      email,
      subscribedAt: new Date().toISOString(),
      status: 'active',
    });

    return Response.json({ message: "Successfully subscribed to our newsletter!" }, { status: 200 });
  } catch (err: any) {
    console.error("Newsletter subscription error:", err);
    return Response.json({ message: "Failed to subscribe. Please try again later." }, { status: 500 });
  }
}
