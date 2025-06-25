/**
 * ItemPageClient - Client Component  
 * Based on Keystone's ItemPage implementation but using ShadCN components
 */

'use client'

import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Fields } from '../../components/Fields'
import { useInvalidFields } from '../../utils/useInvalidFields'
import { useHasChanges, serializeValueToOperationItem } from '../../utils/useHasChanges'
import { enhanceFields } from '../../utils/enhanceFields'
import { Button } from '@/components/ui/button'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { updateItemAction, deleteItemAction } from '../../actions/item-actions'

interface ItemPageClientProps {
  list: any
  item: Record<string, unknown>
  itemId: string
}

// Hook for event callbacks (from Keystone)
function useEventCallback<Func extends (...args: any[]) => unknown>(callback: Func): Func {
  const callbackRef = useRef(callback)
  const cb = useCallback((...args: any[]) => {
    return callbackRef.current(...args)
  }, [])
  useEffect(() => {
    callbackRef.current = callback
  })
  return cb as any
}

// Delete Button Component (adapted from Keystone)
function DeleteButton({ 
  list, 
  value, 
  onError 
}: { 
  list: any; 
  value: Record<string, unknown>; 
  onError: (error: Error) => void 
}) {
  const itemId = ((value.id ?? '') as string | number).toString()
  const router = useRouter()

  const handleDelete = useEventCallback(async () => {
    try {
      // Call server action - following Keystone's Apollo useMutation pattern
      const { errors } = await deleteItemAction(list.key, itemId)
      
      // Handle errors exactly like Keystone does
      const error = errors?.find(x => x.path === undefined || x.path?.length === 1)
      if (error) {
        toast.error('Unable to delete item.', {
          action: {
            label: 'Details',
            onClick: () => onError(new Error(error.message))
          }
        })
        return
      }
      
      toast.success(`${list.singular} deleted successfully.`)
      
      router.push(list.isSingleton ? '/' : `/${list.path}`)
    } catch (err: any) {
      toast.error("Unable to delete item.", {
        action: {
          label: "Details",
          onClick: () => onError(err)
        }
      })
    }
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete item</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{' '}
            <strong>
              {list.singular}
              {!list.isSingleton && ` ${itemId}`}
            </strong>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Reset Button Component (adapted from Keystone)
function ResetButton(props: { onReset: () => void; hasChanges?: boolean }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={!props.hasChanges}>
          Reset
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset changes</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure? Lost changes cannot be recovered.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={props.onReset}>
            Yes, reset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Item Not Found Component (adapted from Keystone)
function ItemNotFound({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-gray-50 rounded-lg p-8">
      <div className="text-gray-400">
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold">Not found</h2>
      <div className="text-center max-w-md text-gray-600">
        {children}
      </div>
    </div>
  )
}

// Error Dialog Component (adapted from Keystone)
function ErrorDialog({ error, onClose }: { error: Error; onClose: () => void }) {
  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Error Details</AlertDialogTitle>
          <AlertDialogDescription>
            {error.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Helper function to deserialize item data using enhanced fields
function deserializeItemToValue(
  enhancedFields: Record<string, any>,
  item: Record<string, unknown | null>
) {
  const result: Record<string, unknown | null> = {}
  
  Object.entries(enhancedFields).forEach(([fieldPath, field]) => {
    try {
      // Enhanced fields already have controllers
      const controller = field.controller
      
      // Create itemForField with only the GraphQL fields this controller needs
      const itemForField: Record<string, unknown> = {}
      // For now, just use the field path as the GraphQL field
      itemForField[field.path] = item?.[field.path] ?? null
      
      // Call deserialize with the properly structured data
      result[fieldPath] = controller.deserialize(itemForField)
    } catch (error) {
      console.error(`Error deserializing field ${fieldPath}:`, error)
    }
  })
  
  return result
}

// Main ItemPageClient component
export function ItemPageClient({ list, item, itemId }: ItemPageClientProps) {
  const router = useRouter()
  
  // Create enhanced fields like Keystone does
  const enhancedFields = useMemo(() => {
    return enhanceFields(list.fields || {}, list.key)
  }, [list.fields, list.key])
  
  // Deserialize the item data once - following Keystone pattern
  const initialValue = useMemo(() => {
    return deserializeItemToValue(enhancedFields, item)
  }, [enhancedFields, item])
  
  // State for form values - initialized with deserialized data
  const [value, setValue] = useState(() => initialValue)
  const [loading, setLoading] = useState(false)
  const [forceValidation, setForceValidation] = useState(false)
  const [errorDialogValue, setErrorDialogValue] = useState<Error | null>(null)
  
  // Reset value when initialValue changes
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  // Create isRequireds object from enhanced fields - exactly like Keystone
  const isRequireds = useMemo(() => {
    const result: Record<string, any> = {}
    
    Object.entries(enhancedFields).forEach(([fieldPath, field]) => {
      result[fieldPath] = field.itemView?.isRequired || false
    })
    
    // Override with dynamic adminMeta data if available
    if (list.adminMetaFields) {
      list.adminMetaFields.forEach((field: any) => {
        if (field.itemView && field.itemView.isRequired !== undefined) {
          result[field.path] = field.itemView.isRequired
        }
      })
    }
    
    return result
  }, [enhancedFields, list.adminMetaFields])

  // Use Keystone's useInvalidFields hook with enhanced fields
  const invalidFields = useInvalidFields(enhancedFields, value, isRequireds)
  
  // Check if we have changes using Keystone's exact pattern with enhanced fields
  const hasChanges = useHasChanges('update', enhancedFields, value, initialValue)

  // Save handler following Keystone's exact pattern
  const handleSave = useEventCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check for invalid fields - exact Keystone pattern
    const newForceValidation = invalidFields.size !== 0
    setForceValidation(newForceValidation)
    if (newForceValidation) {
      console.log('Validation failed, invalid fields:', Array.from(invalidFields))
      return
    }
    
    setLoading(true)
    
    try {
      // Serialize only changed fields - exact Keystone pattern
      const changedData = serializeValueToOperationItem('update', enhancedFields, value, initialValue)
      
      console.log('Saving item with data:', {
        id: initialValue.id,
        data: changedData,
        hasChanges: Object.keys(changedData).length > 0
      })
      
      // Call server action - following Keystone's Apollo useMutation pattern
      const { errors } = await updateItemAction(list.key, initialValue.id as string, changedData)
      
      // Handle errors exactly like Keystone does
      const error = errors?.find(x => x.path === undefined || x.path?.length === 1)
      if (error) {
        toast.error('Unable to save item', {
          action: {
            label: 'Details',
            onClick: () => setErrorDialogValue(new Error(error.message))
          }
        })
        return
      }
      
      toast.success(`Saved changes to ${list.singular.toLowerCase()}`)
      
      // Reset validation state after successful save
      setForceValidation(false)
      
      // TODO: Add onSaveSuccess callback like Keystone does (for refetching data)
      
    } catch (error: any) {
      console.error('Save error:', error)
      toast.error("Unable to save item", {
        action: {
          label: "Details",
          onClick: () => setErrorDialogValue(error)
        }
      })
    } finally {
      setLoading(false)
    }
  })

  // Reset handler
  const handleReset = useCallback(() => {
    setValue(initialValue)
    setForceValidation(false)
  }, [initialValue])

  const pageLabel = (item[list.labelField] || item.id || itemId) as string
  const pageTitle = list.isSingleton || typeof pageLabel !== 'string' ? list.label : pageLabel

  // If item doesn't exist
  if (!item || Object.keys(item).length === 0) {
    return (
      <div className="container mx-auto py-6">
        <ItemNotFound>
          {list.isSingleton ? (
            itemId === '1' ? (
              <div>
                <p>"{list.label}" doesn't exist, or you don't have access to it.</p>
                {!list.hideCreate && (
                  <Button className="mt-4" onClick={() => router.push(`/${list.path}/create`)}>
                    Create {list.singular}
                  </Button>
                )}
              </div>
            ) : (
              <p>An item with ID <strong>"{itemId}"</strong> does not exist.</p>
            )
          ) : (
            <p>
              The item with ID <strong>"{itemId}"</strong> doesn't exist, or you don't have access to it.
            </p>
          )}
        </ItemNotFound>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{pageTitle}</h1>
            <p className="text-gray-600 mt-1">{list.description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <form onSubmit={handleSave} className="flex flex-col lg:flex-row">
        {/* Main Form Area */}
        <div className="flex-1 p-6">
          <div className="space-y-6">
            {/* Debug info */}
            <div className="p-4 bg-gray-100 rounded text-xs">
              <div><strong>isRequireds:</strong> {JSON.stringify(isRequireds)}</div>
              <div><strong>invalidFields:</strong> {JSON.stringify(Array.from(invalidFields))}</div>
              <div><strong>forceValidation:</strong> {JSON.stringify(forceValidation)}</div>
            </div>
            
            {/* Dynamic Fields using Keystone pattern */}
            <Fields
              list={list}
              fields={enhancedFields}
              value={value}
              onChange={setValue}
              forceValidation={forceValidation}
              invalidFields={invalidFields}
              isRequireds={isRequireds}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 border-l bg-gray-50 p-6">
          <div className="space-y-4">
            <h3 className="font-medium">Actions</h3>
            
            {/* Save Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!hasChanges || loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>

            {/* Reset Button */}
            <ResetButton hasChanges={hasChanges} onReset={handleReset} />

            {/* Delete Button */}
            {!list.hideDelete && (
              <DeleteButton 
                list={list} 
                value={value} 
                onError={setErrorDialogValue}
              />
            )}
          </div>
        </div>
      </form>

      {/* Error Dialog */}
      {errorDialogValue && (
        <ErrorDialog 
          error={errorDialogValue} 
          onClose={() => setErrorDialogValue(null)} 
        />
      )}
    </div>
  )
}