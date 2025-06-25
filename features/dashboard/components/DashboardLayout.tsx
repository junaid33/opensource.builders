import { AdminMetaProvider } from "@/features/dashboard/components/AdminMetaProvider";
import { getAdminMeta } from "@/features/dashboard/actions";
import { getAuthenticatedUser } from "@/features/dashboard/actions/auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Fetch admin metadata and user data concurrently
  const [adminMeta, userResponse] = await Promise.all([
    getAdminMeta(),
    getAuthenticatedUser()
  ]);

  const user = userResponse.success ? userResponse.data?.authenticatedItem : null;

  return (
    <AdminMetaProvider adminMeta={adminMeta} user={user}>
      {children}
    </AdminMetaProvider>
  );
}
