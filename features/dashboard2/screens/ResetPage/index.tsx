/**
 * ResetPage for Dashboard 2
 * Password reset functionality with Dashboard 1's ShadCN UI styling
 */

'use client'

import React, { useState, FormEvent } from 'react'
import Link from 'next/link'
import { Database, Mail, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

interface ResetPageProps {
  identityField?: string
}

export function ResetPage({ identityField = 'email' }: ResetPageProps) {
  const [identity, setIdentity] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!identity.trim()) {
      setError(`Please enter your ${identityField}`)
      return
    }

    // Basic email validation if it's an email field
    if (identityField === 'email' && !identity.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // TODO: Replace with actual password reset logic
      console.log('Sending password reset to:', identity)
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsSuccess(true)
      
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset')
    } finally {
      setIsLoading(false)
    }
  }

  const capitalizeFirstLetter = (str: string) => 
    str.charAt(0).toUpperCase() + str.slice(1)

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-6 p-6">
          {/* Logo/Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Database className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Check your {identityField}</h1>
          </div>

          {/* Success Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Reset link sent!</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a password reset link to <strong>{identity}</strong>. 
                    Click the link in your {identityField} to reset your password.
                  </p>
                </div>

                <div className="pt-4 space-y-3">
                  <Button asChild className="w-full">
                    <Link href="/dashboard2/signin">
                      Back to sign in
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsSuccess(false)
                      setIdentity('')
                      setError('')
                    }}
                    className="w-full"
                  >
                    Send to different {identityField}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center">
            <Link 
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to main site
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 p-6">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Database className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-muted-foreground">
            Enter your {identityField} and we'll send you a link to reset your password
          </p>
        </div>

        {/* Reset Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Password reset
            </CardTitle>
            <CardDescription>
              We'll send instructions to your {identityField}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Identity Field */}
              <div className="space-y-2">
                <Label htmlFor="identity">
                  {capitalizeFirstLetter(identityField)}
                </Label>
                <Input
                  id="identity"
                  name="identity"
                  type={identityField === 'email' ? 'email' : 'text'}
                  placeholder={`Enter your ${identityField}`}
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  required
                  autoFocus
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !identity.trim()}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-background border-t-current rounded-full" />
                    Sending...
                  </>
                ) : (
                  'Send reset link'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center space-y-2">
          <div className="text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link 
              href="/dashboard2/signin" 
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>

        <Separator />

        {/* Back to main site */}
        <div className="text-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to main site
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPage