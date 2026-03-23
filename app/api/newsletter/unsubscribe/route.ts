import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

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

    const subscriber = await client.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email }
    );

    if (!subscriber) {
      // Don't reveal whether the email exists
      return Response.json({ message: "You have been unsubscribed." }, { status: 200 });
    }

    if (subscriber.status === "unsubscribed") {
      return Response.json({ message: "You have been unsubscribed." }, { status: 200 });
    }

    await client
      .patch(subscriber._id)
      .set({ status: "unsubscribed" })
      .commit();

    return Response.json({ message: "You have been unsubscribed." }, { status: 200 });
  } catch (err: any) {
    console.error("Newsletter unsubscribe error:", err);
    return Response.json({ message: "Failed to unsubscribe. Please try again later." }, { status: 500 });
  }
}
