/**
 * InitPage for Dashboard 2
 * Based on Dashboard 1's UI with Dashboard 2's functionality
 */

'use client'

import React, { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/features/dashboard/components/Logo'

interface InitPageProps {
  listKey?: string
  fieldPaths?: string[]
}

export function InitPage({ 
  listKey = 'User',
  fieldPaths = ['name', 'email', 'password'] 
}: InitPageProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Basic validation
    const missingFields = fieldPaths.filter(field => !formData[field]?.trim())
    if (missingFields.length > 0) {
      setError(`Please fill in all fields: ${missingFields.join(', ')}`)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // TODO: Replace with actual GraphQL mutation for creating initial user
      console.log('Creating initial user with data:', formData)
      
      // Mock creation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to dashboard after successful creation
      router.push('/dashboard2')
      
    } catch (err: any) {
      setError(err.message || 'Failed to create initial user')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFieldChange = (fieldPath: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldPath]: value }))
  }

  const getFieldLabel = (fieldPath: string) => {
    const labels: Record<string, string> = {
      name: 'Name',
      email: 'Email',
      password: 'Password',
      username: 'Username'
    }
    return labels[fieldPath] || fieldPath.charAt(0).toUpperCase() + fieldPath.slice(1)
  }

  const getFieldType = (fieldPath: string) => {
    const types: Record<string, string> = {
      email: 'email',
      password: showPassword ? 'text' : 'password'
    }
    return types[fieldPath] || 'text'
  }

  const getFieldPlaceholder = (fieldPath: string) => {
    const placeholders: Record<string, string> = {
      name: 'Enter your name',
      email: 'you@example.com',
      password: '••••••••',
      username: 'Choose a username'
    }
    return placeholders[fieldPath] || `Enter ${fieldPath}`
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex items-center space-x-1.5">
          <Logo aria-hidden="true" />
        </div>
        <h3 className="mt-6 text-lg font-semibold text-foreground dark:text-foreground">
          Create admin account
        </h3>
        <p className="mt-2 text-sm text-muted-foreground dark:text-muted-foreground">
          Set up your admin account to get started.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {fieldPaths.map((fieldPath) => (
            <div key={fieldPath}>
              <Label
                htmlFor={fieldPath}
                className="text-sm font-medium text-foreground dark:text-foreground"
              >
                {getFieldLabel(fieldPath)}
              </Label>
              {fieldPath === 'password' ? (
                <div className="relative mt-2">
                  <Input
                    type={getFieldType(fieldPath)}
                    id={fieldPath}
                    name={fieldPath}
                    autoComplete={fieldPath === 'password' ? 'new-password' : fieldPath}
                    placeholder={getFieldPlaceholder(fieldPath)}
                    className="pr-10 bg-muted/40"
                    value={formData[fieldPath] || ''}
                    onChange={(e) => handleFieldChange(fieldPath, e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              ) : (
                <Input
                  type={getFieldType(fieldPath)}
                  id={fieldPath}
                  name={fieldPath}
                  autoComplete={fieldPath}
                  placeholder={getFieldPlaceholder(fieldPath)}
                  className="mt-2 bg-muted/40"
                  value={formData[fieldPath] || ''}
                  onChange={(e) => handleFieldChange(fieldPath, e.target.value)}
                  disabled={isLoading}
                  required
                />
              )}
            </div>
          ))}
          
          <Button 
            type="submit" 
            className="w-full py-2 font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-background border-t-current rounded-full" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </form>

        {error && (
          <Badge variant="destructive" className="hover:bg-destructive/10 bg-destructive/5 flex text-base items-start gap-2 border border-destructive/50 p-4 rounded-sm mt-4">
            <div className="flex flex-col gap-1">
              <h2 className="uppercase tracking-wider font-semibold text-sm">Error</h2>
              <span className="break-all text-sm opacity-75 font-normal">{error}</span>
            </div>
          </Badge>
        )}
      </div>
    </div>
  )
}

export default InitPage