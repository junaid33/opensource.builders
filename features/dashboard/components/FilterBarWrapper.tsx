import { FilterBar, ListMeta, SortOption } from './FilterBar';

// Import our List type from the hooks
import { List, Field } from '@/features/dashboard/types';

interface FilterBarWrapperProps {
  list: List;
  selectedFields: string[];
  currentSort: SortOption | null;
}

export function FilterBarWrapper({ list, selectedFields, currentSort }: FilterBarWrapperProps) {
  // Convert our List type to the ListMeta type expected by FilterBar
  const listMeta: ListMeta = {
    key: list.key,
    path: list.path,
    label: list.label,
    singular: list.singular,
    plural: list.plural,
    initialColumns: list.initialColumns,
    fields: Object.entries(list.fields).reduce((acc: ListMeta['fields'], [path, field]: [string, Field]) => {
      acc[path] = {
        path: field.path,
        label: field.label,
        isFilterable: field.isFilterable,
        isOrderable: field.isOrderable,
        viewsIndex: field.viewsIndex,
      };
      return acc;
    }, {} as ListMeta['fields']),
  };

  return (
    <FilterBar
      listMeta={listMeta}
      selectedFields={selectedFields}
      currentSort={currentSort}
    />
  );
}