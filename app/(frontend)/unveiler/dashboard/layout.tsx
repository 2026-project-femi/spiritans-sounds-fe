import { redirect } from 'next/navigation';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { cookies, headers } from 'next/headers';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config: configPromise });
  const req = {
    headers: await headers(),
    cookies: await cookies(),
  };

  // Verify authentication
  const { user } = await payload.auth(req as any);

  if (
    !user ||
    (user.role !== 'author' && user.role !== 'publishing_admin' && user.role !== 'admin')
  ) {
    redirect('/unveiler/login');
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col md:flex-row">
      {/* Responsive Navigation */}
      <DashboardNav user={user} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  );
}
