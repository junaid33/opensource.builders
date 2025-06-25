/**
 * SignInPage for Dashboard 2
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

interface SignInPageProps {
  identityField?: string
  secretField?: string
  error?: string
}

export function SignInPage({ 
  identityField = 'email', 
  secretField = 'password',
  error: serverError
}: SignInPageProps) {
  const router = useRouter()
  const [credentials, setCredentials] = useState({
    identity: '',
    secret: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(serverError || '')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!credentials.identity || !credentials.secret) {
      setError('Please fill in all fields')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // TODO: Replace with actual authentication logic
      console.log('Signing in with:', credentials)
      
      // Mock authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock success - redirect to dashboard
      router.push('/dashboard2')
      
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex items-center space-x-1.5">
          <Logo aria-hidden="true" />
        </div>
        <h3 className="mt-6 text-lg font-semibold text-foreground dark:text-foreground">
          Sign in to your account
        </h3>
        <p className="mt-2 text-sm text-muted-foreground dark:text-muted-foreground">
          Don&apos;t have an account?
          <Link
            href="/dashboard2/signup"
            className="ml-1 font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
          >
            Sign up
          </Link>
        </p>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <Label
              htmlFor="identity"
              className="text-sm font-medium text-foreground dark:text-foreground"
            >
              {identityField === 'email' ? 'Email' : identityField.charAt(0).toUpperCase() + identityField.slice(1)}
            </Label>
            <Input
              type={identityField === 'email' ? 'email' : 'text'}
              id="identity"
              name="identity"
              autoComplete={identityField === 'email' ? 'email' : 'username'}
              placeholder={identityField === 'email' ? 'you@example.com' : `Enter your ${identityField}`}
              className="mt-2 bg-muted/40"
              value={credentials.identity}
              onChange={(e) => setCredentials(prev => ({ 
                ...prev, 
                identity: e.target.value 
              }))}
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <Label
              htmlFor="secret"
              className="text-sm font-medium text-foreground dark:text-foreground"
            >
              {secretField.charAt(0).toUpperCase() + secretField.slice(1)}
            </Label>
            <div className="relative mt-2">
              <Input
                type={showPassword ? "text" : "password"}
                id="secret"
                name="secret"
                autoComplete="current-password"
                placeholder="••••••••"
                className="pr-10 bg-muted/40"
                value={credentials.secret}
                onChange={(e) => setCredentials(prev => ({ 
                  ...prev, 
                  secret: e.target.value 
                }))}
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
            disabled={isLoading || !credentials.identity || !credentials.secret}
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-background border-t-current rounded-full" />
                Signing in...
              </>
            ) : (
              'Sign in'
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

        <p className="mt-6 text-sm text-muted-foreground dark:text-muted-foreground">
          Forgot your password?
          <Link
            href="/dashboard2/reset"
            className="ml-1 font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
          >
            Reset password
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignInPage