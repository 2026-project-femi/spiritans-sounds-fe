import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { cookies, headers } from "next/headers";
import AuthorProfileForm from "@/components/dashboard/AuthorProfileForm";

export const dynamic = "force-dynamic";

export default async function AuthorProfilePage() {
  const payload = await getPayload({ config: configPromise });
  const req = {
    headers: await headers(),
    cookies: await cookies(),
  };

  const { user: authUser } = await payload.auth(req as any);
  if (!authUser) return null;

  // Fetch full user record to guarantee latest data
  const user = await payload.findByID({
    collection: "users",
    id: authUser.id,
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Profile & Settings</h1>
        <p className="text-gray-400 mt-2">
          Manage your author bio, contact details, and payout bank information.
        </p>
      </div>

      <AuthorProfileForm
        key={`${user.id}-${user.updatedAt || ''}`}
        initialUser={{
          id: user.id,
          name: user.name,
          email: user.email,
          phone: (user as any).phone || "",
          country: (user as any).country || "",
          role: user.role,
          authorType: user.authorType,
          authorBio: user.authorBio,
          bankDetails: user.bankDetails,
        }}
      />
    </div>
  );
}

