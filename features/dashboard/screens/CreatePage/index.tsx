import { notFound } from "next/navigation";
import { PageBreadcrumbs } from "@/features/dashboard/components/PageBreadcrumbs";
import { getListByPath } from "@/features/dashboard/actions";
import { CreatePageClient } from "./CreatePageClient";

interface CreatePageParams {
  params: Promise<{
    listKey: string;
  }>;
}

export async function CreatePage({ params }: CreatePageParams) {
  const resolvedParams = await params;
  const { listKey: path } = resolvedParams;

  // Get the list configuration server-side only for validation
  const list = await getListByPath(path);

  if (!list) {
    // Use Next.js notFound utility if list doesn't exist
    notFound();
  }

  return (
    <>
      <PageBreadcrumbs
        items={[
          { type: "link", label: "Dashboard", href: "/" },
          { type: "model", label: list.label, href: `/${list.path}`, showModelSwitcher: true },
          { type: "page", label: "Create" }
        ]}
      />

      <CreatePageClient listKey={path} />
    </>
  );
}

export default CreatePage; 