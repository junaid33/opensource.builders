/**
 * ListPageClient - Client Component  
 * Based on Keystone's ListPage implementation but using ShadCN components
 * Follows the same pattern as ItemPageClient
 */

'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  SearchX,
  Table as TableIcon 
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PageContainer } from '../../components/PageContainer'
import { FilterBar } from '../../components/FilterBar'
import { ListTable } from '../../components/ListTable'
import { useDashboard } from '../../context/DashboardProvider'
import { useSelectedFields } from '../../hooks/useSelectedFields'
import { useSort } from '../../hooks/useSort'

interface ListPageClientProps {
  list: any
  initialData: { items: any[], count: number }
  initialError: string | null
  initialSearchParams: {
    page: number
    pageSize: number  
    search: string
  }
}

function EmptyState({ isFiltered }: { isFiltered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {isFiltered ? (
        <>
          <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground">
            No items found. Try adjusting your search or filters.
          </p>
        </>
      ) : (
        <>
          <TableIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No items yet</h3>
          <p className="text-muted-foreground">
            Add the first item to see it here.
          </p>
        </>
      )}
    </div>
  )
}


export function ListPageClient({ 
  list, 
  initialData, 
  initialError, 
  initialSearchParams 
}: ListPageClientProps) {
  const router = useRouter()
  const { basePath } = useDashboard()
  // Hooks for sorting and field selection
  const selectedFields = useSelectedFields(list)
  const sort = useSort(list)

  // Extract data from props
  const data = initialData
  const error = initialError
  const currentPage = initialSearchParams.page
  const pageSize = initialSearchParams.pageSize
  const searchString = initialSearchParams.search

  // Handle page change - simplified since FilterBar handles search/filters
  const handlePageChange = useCallback((newPage: number) => {
    const params = new URLSearchParams(window.location.search)
    
    if (newPage && newPage > 1) {
      params.set('page', newPage.toString())
    } else {
      params.delete('page')
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : ''
    router.push(newUrl)
  }, [router])

  if (!list) {
    return (
      <PageContainer title="List not found">
        <Alert variant="destructive">
          <AlertDescription>
            The requested list was not found.
          </AlertDescription>
        </Alert>
      </PageContainer>
    )
  }

  const breadcrumbs = [
    { type: 'link' as const, label: 'Dashboard', href: basePath },
    { type: 'page' as const, label: list.label }
  ]

  const header = (
    <div className="flex items-center justify-between">
      <h1 className="text-lg font-semibold md:text-2xl">{list.label}</h1>
    </div>
  )

  // Check if we have any active filters (search or actual filters)
  const hasFilters = !!searchString
  const isFiltered = hasFilters
  const isEmpty = data?.count === 0 && !isFiltered

  return (
    <PageContainer title={list.label} header={header} breadcrumbs={breadcrumbs}>
      <div className="space-y-4">
        {/* Filter Bar - includes search, filters, sorting, field selection, and create button */}
        <FilterBar list={list} selectedFields={selectedFields} />


        {/* Data table */}
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load items: {error}
            </AlertDescription>
          </Alert>
        ) : isEmpty ? (
          <EmptyState isFiltered={false} />
        ) : data?.count === 0 ? (
          <EmptyState isFiltered={isFiltered} />
        ) : (
          <ListTable
            data={data}
            list={list}
            selectedFields={selectedFields}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        )}
      </div>
    </PageContainer>
  )
}