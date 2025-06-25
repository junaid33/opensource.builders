export const dynamic = 'force-dynamic';

import { DashboardLayout } from '@/features/dashboard2/components/DashboardLayout';
import { getAdminMetaAction } from '@/features/dashboard2/actions/getAdminMetaAction';

export default async function ListLayout({ children }: { children: React.ReactNode }) {
  // Fetch adminMeta server-side to avoid loading states
  const adminMetaResponse = await getAdminMetaAction();
  const adminMeta = adminMetaResponse.success ? adminMetaResponse.data : null;

  return <DashboardLayout adminMeta={adminMeta}>{children}</DashboardLayout>;
}