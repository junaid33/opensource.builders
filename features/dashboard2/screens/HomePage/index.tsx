/**
 * HomePage for Dashboard 2
 * Combines Keystone's GraphQL data fetching with Dashboard 1's ShadCN UI styling
 */

'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { PlusIcon, Database, AlertTriangle } from 'lucide-react'
import useSWR from 'swr'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { PageContainer } from '../../components/PageContainer'
import { useAdminMeta } from '../../hooks/useAdminMeta'
import { useDashboard } from '../../context/DashboardProvider'
import { cn } from '@/lib/utils'

// GraphQL query builder for list counts - following Keystone's pattern
function buildListCountsQuery(lists: Record<string, any>) {
  const listEntries = Object.values(lists)
  if (listEntries.length === 0) return null

  const countQueries = listEntries.map((list: any) => 
    `${list.key}: ${list.gqlNames?.listQueryCountName || `${list.key.toLowerCase()}sCount`}`
  ).join('\n      ')

  return `
    query KsFetchListCounts {
      keystone {
        adminMeta {
          lists {
            key
          }
        }
      }
      ${countQueries}
    }
  `
}

// Data fetcher for SWR - using your existing GraphQL infrastructure
async function fetchListCounts(lists: Record<string, any>) {
  const query = buildListCountsQuery(lists)
  if (!query) return {}

  // This would use your actual GraphQL client
  // For now, return mock data - replace with actual implementation
  const listKeys = Object.keys(lists)
  const mockCounts: Record<string, number> = {}
  listKeys.forEach(key => {
    mockCounts[key] = Math.floor(Math.random() * 100)
  })
  return mockCounts
}

interface ListCardProps {
  list: any
  count?: number | null
  hideCreate?: boolean
}

function ListCard({ list, count, hideCreate = false }: ListCardProps) {
  const { basePath } = useDashboard()
  const isSingleton = list.isSingleton || false
  const href = `${basePath}/${list.path}${isSingleton ? '/1' : ''}`

  return (
    <Card className={cn(
      'relative bg-gradient-to-bl from-background to-muted/80 shadow-xs hover:bg-muted transition-colors'
    )}>
      <Link href={href}>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-foreground">
            {list.label}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {isSingleton 
              ? 'Singleton' 
              : count === null 
                ? 'Unknown'
                : `${count} item${count !== 1 ? 's' : ''}`
            }
          </p>
        </CardContent>
      </Link>
      
      {!hideCreate && !isSingleton && (
        <Link 
          href={`${basePath}/${list.path}/create`}
          className="absolute top-3 right-3"
        >
          <Button
            variant="outline" 
            size="icon"
            className="h-7 w-7"
            title={`Add ${list.singular?.toLowerCase() || 'item'}`}
          >
            <PlusIcon className="h-4 w-4" />
            <span className="sr-only">Create new {list.label}</span>
          </Button>
        </Link>
      )}
    </Card>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="bg-gradient-to-bl from-background to-muted/80">
          <CardContent className="p-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>Failed to load dashboard data: {error.message}</span>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Database className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No lists configured</h3>
      <p className="text-muted-foreground">
        There are no data models configured in your admin interface.
      </p>
    </div>
  )
}

export function HomePage() {
  const { adminMeta } = useAdminMeta()
  const lists = adminMeta?.lists ?? {}
  const listsArray = Object.values(lists)

  // SWR for data fetching - following your existing patterns
  const { data: countData, error, mutate } = useSWR(
    lists && Object.keys(lists).length > 0 ? ['list-counts', lists] : null,
    () => fetchListCounts(lists),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // 30 seconds
    }
  )

  const breadcrumbs = [
    { type: 'page' as const, label: 'Dashboard' }
  ]

  const header = (
    <div className="flex flex-col">
      <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      {listsArray.length > 0 && (
        <p className="text-muted-foreground">{listsArray.length} Models</p>
      )}
    </div>
  )

  if (error) {
    return (
      <PageContainer title="Dashboard" header={header} breadcrumbs={breadcrumbs}>
        <ErrorState error={error} onRetry={() => mutate()} />
      </PageContainer>
    )
  }

  if (listsArray.length === 0) {
    return (
      <PageContainer title="Dashboard" header={header} breadcrumbs={breadcrumbs}>
        <EmptyState />
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Dashboard" header={header} breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <div>
          <h2 className="tracking-wide uppercase font-medium mb-3 text-muted-foreground text-sm">
            Data Models
          </h2>
          
          {!countData ? (
            <LoadingGrid />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-4">
              {listsArray.map((list: any) => (
                <ListCard
                  key={list.key}
                  list={list}
                  count={countData[list.key] ?? null}
                  hideCreate={list.hideCreate ?? false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}

export default HomePage