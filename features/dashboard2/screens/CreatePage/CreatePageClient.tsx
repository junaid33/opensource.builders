/**
 * CreatePageClient for Dashboard 2
 * Client component with form functionality
 */

'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, ArrowLeft, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PageContainer } from '../../components/PageContainer'
import { useDashboard } from '../../context/DashboardProvider'
import { Fields } from '../../components/Fields'
import { useCreateItem } from '../../utils/useCreateItem'

interface CreatePageClientProps {
  listKey: string
  list: any
}

function ToolbarActions({ 
  onSave, 
  onCancel, 
  isLoading, 
  hasChanges,
  list 
}: {
  onSave: () => void
  onCancel: () => void
  isLoading: boolean
  hasChanges: boolean
  list: any
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={onSave}
              disabled={isLoading}
              className="min-w-20"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-background border-t-current rounded-full" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create {list.singular}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {hasChanges ? 'Unsaved changes' : 'No changes'}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MobileToolbar({ 
  onSave, 
  onCancel, 
  isLoading, 
  hasChanges,
  list 
}: {
  onSave: () => void
  onCancel: () => void
  isLoading: boolean
  hasChanges: boolean
  list: any
}) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-background border rounded-lg shadow-lg p-2 md:hidden">
      <Button
        onClick={onSave}
        disabled={isLoading}
        size="sm"
      >
        {isLoading ? (
          <div className="animate-spin h-4 w-4 border-2 border-background border-t-current rounded-full" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        Create
      </Button>
      <Button variant="outline" size="sm" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  )
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
      <div className="sticky top-6 space-y-4">
        {children}
      </div>
    </div>
  )
}

function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 min-w-0 space-y-6">
      {children}
    </div>
  )
}

export function CreatePageClient({ listKey, list }: CreatePageClientProps) {
  const { basePath } = useDashboard()
  const router = useRouter()
  
  // Use the create item hook - similar to Keystone's useCreateItem
  const createItem = useCreateItem(list)

  const handleSave = useCallback(async () => {
    if (!createItem) return
    
    const item = await createItem.create()
    if (item) {
      router.push(`${basePath}/${list.path}/${item.id}`)
    }
  }, [createItem, router, basePath, list])

  const handleCancel = useCallback(() => {
    router.push(`${basePath}/${list.path}`)
  }, [router, basePath, list])

  if (!list) {
    return (
      <PageContainer title="List not found">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            The requested list "{listKey}" was not found.
          </AlertDescription>
        </Alert>
      </PageContainer>
    )
  }

  const breadcrumbs = [
    { type: 'link' as const, label: 'Dashboard', href: basePath },
    { type: 'link' as const, label: list.label, href: `${basePath}/${list.path}` },
    { type: 'page' as const, label: 'Create' }
  ]

  const header = (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`${basePath}/${list.path}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {list.label}
        </Link>
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <div>
        <h1 className="text-lg font-semibold md:text-2xl">
          Create {list.singular}
        </h1>
        <p className="text-sm text-muted-foreground">
          Add a new {list.singular.toLowerCase()} to {list.label.toLowerCase()}
        </p>
      </div>
    </div>
  )

  if (!createItem) {
    return (
      <PageContainer title={`Create ${list.singular}`} header={header} breadcrumbs={breadcrumbs}>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to initialize creation form for {list.label}.
          </AlertDescription>
        </Alert>
      </PageContainer>
    )
  }

  return (
    <PageContainer title={`Create ${list.singular}`} header={header} breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6">
          <MainContent>
            {/* GraphQL errors */}
            {(createItem.error?.networkError || createItem.error?.graphQLErrors?.length) && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {createItem.error.networkError?.message || 
                   createItem.error.graphQLErrors?.[0]?.message ||
                   'An error occurred while creating the item'
                  }
                </AlertDescription>
              </Alert>
            )}

            {/* Form fields */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Fields {...createItem.props} />
              </CardContent>
            </Card>
          </MainContent>

          <Sidebar>
            <ToolbarActions
              onSave={handleSave}
              onCancel={handleCancel}
              isLoading={createItem.state === 'loading'}
              hasChanges={true} // In create mode, we always have "changes"
              list={list}
            />
          </Sidebar>
        </div>

        {/* Mobile floating toolbar */}
        <MobileToolbar
          onSave={handleSave}
          onCancel={handleCancel}
          isLoading={createItem.state === 'loading'}
          hasChanges={true}
          list={list}
        />
      </div>
    </PageContainer>
  )
}

export default CreatePageClient