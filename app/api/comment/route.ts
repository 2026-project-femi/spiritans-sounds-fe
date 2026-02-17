import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export async function POST(req: Request) {
  const { _id, name, email, comment } = await req.json();

  if (!_id || !name || !email || !comment) {
      return Response.json({ message: "Missing required fields" }, { status: 400 });
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

  try {
    await client.create({
      _type: "comment",
      post: {
        _type: "reference",
        _ref: _id,
      },
      name,
      email,
      comment,
      approved: false, // Moderation: Comments must be approved in Studio
    });
    return Response.json({ message: "Comment submitted for approval" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Failed to submit comment" }, { status: 500 });
  }
}
