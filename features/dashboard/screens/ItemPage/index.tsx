import { getItemAction, getListByPath } from '@/features/dashboard/actions';
import type { List, Field } from '@/features/dashboard/types';
import { PageBreadcrumbs } from '@/features/dashboard/components/PageBreadcrumbs';
import { notFound } from 'next/navigation';
import { ItemPageClient } from './ItemPageClient';

interface ItemPageParams {
  params: Promise<{
    listKey: string;
    id: string;
  }>;
}

export async function ItemPage({ params }: ItemPageParams) {
  const resolvedParams = await params;
  const listKey = resolvedParams.listKey;
  const itemId = resolvedParams.id;

  const list = (await getListByPath(listKey)) as List;

  if (!list) {
    notFound();
  }

  // Configure Next.js cache options
  const cacheOptions = {
    next: {
      tags: [`item-${list.key}-${itemId}`],
      revalidate: 3600, // Cache for 1 hour as fallback
    },
  };

  // Fetch item data with the correct list key and cache tag
  const response = await getItemAction(list, itemId, cacheOptions);

  let fetchedItem: Record<string, unknown> = {};

  if (response.success) {
    fetchedItem = response.data.item as Record<string, unknown>;
  } else {
    console.error('Error fetching item:', response.error);
    // Assign default empty object in case of error
    fetchedItem = {};
  }

  // Get field modes and positions from list configuration
  const fieldModes: Record<string, 'edit' | 'read' | 'hidden'> = {};
  const fieldPositions: Record<string, 'form' | 'sidebar'> = {};

  Object.entries(list.fields).forEach(([path, field]: [string, Field]) => {
    fieldModes[path] = (field.itemView?.fieldMode || 'edit') as
      | 'edit'
      | 'read'
      | 'hidden';
    fieldPositions[path] = (field.itemView?.fieldPosition || 'form') as
      | 'form'
      | 'sidebar';
  });

  // Extract UI configuration settings
  const uiConfig = {
    hideDelete: list.hideDelete || false,
    hideCreate: list.hideCreate || false,
  };

  return (
    <>
      <PageBreadcrumbs
        items={[
          { type: 'link', label: 'Dashboard', href: '/' },
          {
            type: 'model',
            label: list.label,
            href: `/${list.path}`,
            showModelSwitcher: true,
          },
          {
            type: 'page',
            label: (fetchedItem[list.labelField] || fetchedItem.id || itemId) as string,
          },
        ]}
      />
      <ItemPageClient
        item={fetchedItem}
        id={itemId}
        listKey={listKey}
        fieldModes={fieldModes}
        fieldPositions={fieldPositions}
        uiConfig={uiConfig}
      />
    </>
  );
}

export default ItemPage; 