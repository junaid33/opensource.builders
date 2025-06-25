/**
 * SignUpPage for Dashboard 2
 * Based on Dashboard 1's UI with Dashboard 2's functionality
 */

'use client'

import React, { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/features/dashboard/components/Logo'

interface SignUpPageProps {
  allowRegistration?: boolean
}

export function SignUpPage({ allowRegistration = true }: SignUpPageProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // TODO: Replace with actual registration logic
      console.log('Registering user with:', formData)
      
      // Mock registration
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to sign in after successful registration
      router.push('/dashboard2/signin?message=registration-success')
      
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex items-center space-x-1.5">
          <Logo aria-hidden="true" />
        </div>
        <h3 className="mt-6 text-lg font-semibold text-foreground dark:text-foreground">
          Create your account
        </h3>
        <p className="mt-2 text-sm text-muted-foreground dark:text-muted-foreground">
          Already have an account?
          <Link
            href="/dashboard2/signin"
            className="ml-1 font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
          >
            Sign in
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-foreground dark:text-foreground"
            >
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-2 bg-muted/40"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <Label
              htmlFor="password"
              className="text-sm font-medium text-foreground dark:text-foreground"
            >
              Password
            </Label>
            <div className="relative mt-2">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className="pr-10 bg-muted/40"
                value={formData.password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
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
          </div>
          <Button 
            type="submit" 
            className="w-full py-2 font-medium"
            disabled={isLoading || !formData.email || !formData.password}
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-background border-t-current rounded-full" />
                Creating account...
              </>
            ) : (
              'Sign up'
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

export default SignUpPage