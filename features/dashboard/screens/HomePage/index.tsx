import Link from 'next/link';
import {
  PlusIcon,
  LucideIcon,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { PageBreadcrumbs } from '@/features/dashboard/components/PageBreadcrumbs';
import { getAdminMeta } from '@/features/dashboard/actions';
import { basePath } from '@/features/dashboard/lib/config';
import { getListCounts } from '@/features/dashboard/actions';
import { Button } from '@/components/ui/button';

// Define interfaces for the data shapes if not available globally
// For now, using 'any' where specific shapes are not fully clear from context
interface AdminMetaShape {
  lists: Record<string, ListItemForDashboard>;
  // Add other properties of adminMeta if known
}

interface ListItemForDashboard {
  key: string;
  label: string;
  path: string;
  isSingleton?: boolean;
  plural?: string;
  // Add other properties if known
}


interface ListCardProps {
  list: ListItemForDashboard; // Use the defined interface
  count?: number;
  hideCreate?: boolean;
}

const ListCard = ({ list, count, hideCreate = false }: ListCardProps) => {
  const isSingleton = list.isSingleton || false;
  const href = `${basePath}/${list.path}${isSingleton ? '/1' : ''}`;

  return (
    <Card
      className={cn(
        'relative bg-gradient-to-bl from-background to-muted/80 shadow-xs hover:bg-muted transition-colors'
      )}
    >
      <Link href={href}>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-foreground">
            {list.label}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {isSingleton ? 'Singleton' : `${count || 0} items`}
          </p>
        </CardContent>
      </Link>
      
      {hideCreate === false && !isSingleton && (
        <Link 
          href={`${basePath}/${list.path}/create`}
          className="absolute top-3 right-3"
        >
          <Button
            variant="outline" 
            size="icon"
            className="h-7 w-7"
          >
            <PlusIcon className="h-4 w-4" />
            <span className="sr-only">Create new {list.label}</span>
          </Button>
        </Link>
      )}
    </Card>
  );
};

interface PlatformCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  href: string;
  iconForeground: string;
  iconBackground: string;
  ringColorClass: string;
}

const PlatformCard = ({
  title,
  description,
  icon: Icon,
  href,
  iconForeground,
  iconBackground,
  ringColorClass,
}: PlatformCardProps) => (
  <Card
    className={cn(
      'bg-gradient-to-bl from-background to-muted/80 shadow-xs group relative rounded-xl border p-0 focus-within:ring-2 focus-within:ring-ring focus-within:ring-inset'
    )}
  >
    <CardContent className="p-4">
      <div>
        {Icon && (
          <span
            className={cn(
              iconBackground,
              iconForeground,
              'inline-flex rounded-lg p-2 ring-1 ring-inset',
              ringColorClass
            )}
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
          </span>
        )}
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-semibold text-foreground">
          <Link href={href} className="focus:outline-none">
            <span aria-hidden="true" className="absolute inset-0" />
            {title}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-4 right-4 text-muted-foreground/50 group-hover:text-muted-foreground/60"
      >
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </CardContent>
  </Card>
);

export async function HomePage() {
  const adminMeta: AdminMetaShape = await getAdminMeta();
  const listsArray = Object.values(adminMeta.lists);
  const response = await getListCounts(listsArray); // No need for type casting
  const countData: Record<string, number> =
    response.success && 'data' in response && response.data
      ? response.data
      : {};

  return (
    <>
      <PageBreadcrumbs
        items={[
          {
            type: 'page',
            label: 'Dashboard',
          },
        ]}
      />
      <main className="w-full max-w-4xl p-4 md:p-6 flex flex-col gap-4">
        <div className="flex-col items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
          {listsArray.length > 0 && (
            <p className="text-muted-foreground">{listsArray.length} Models</p>
          )}
        </div>


        <div className="mb-4">
          <h2 className="tracking-wide uppercase font-medium mb-2 text-muted-foreground">
            Data Models
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-4">
            {listsArray.map((list: ListItemForDashboard) => (
              <ListCard
                key={list.key}
                list={list}
                count={countData[list.key]}
                hideCreate={false}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
