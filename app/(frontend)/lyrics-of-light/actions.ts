"use server";

import { getPayload } from "payload";
import configPromise from "@/payload.config";

export async function captureEmailForEbook(email: string) {
  if (!email || !email.includes("@")) {
    return { success: false, error: "Invalid email address" };
  }

  try {
    const payload = await getPayload({ config: configPromise });
    
    // Check if subscriber already exists
    const existing = await payload.find({
      collection: "subscribers",
      where: { email: { equals: email } },
    });

    if (existing.docs.length === 0) {
      // Create new subscriber
      await payload.create({
        collection: "subscribers",
        data: {
          email,
          status: "subscribed",
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error capturing email:", error);
    return { success: false, error: "Failed to capture email" };
  }
}
