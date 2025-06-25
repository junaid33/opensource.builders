/**
 * NoAccessPage for Dashboard 2
 * Based on Keystone's NoAccessPage with Dashboard 1's ShadCN UI styling
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface NoAccessPageProps {
  sessionsEnabled?: boolean
  returnUrl?: string
}

export function NoAccessPage({ 
  sessionsEnabled = true, 
  returnUrl = '/' 
}: NoAccessPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <ShieldAlert className="h-8 w-8 text-destructive" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">
                  Access Denied
                </h1>
                <p className="text-muted-foreground">
                  You don't have permission to access this page. You may need to request 
                  access from your system administrator or sign in with a different account.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {sessionsEnabled && (
                  <Button asChild className="w-full">
                    <Link href="/dashboard2/signin">
                      Sign in with different account
                    </Link>
                  </Button>
                )}
                
                <Button variant="outline" asChild className="w-full">
                  <Link href={returnUrl}>
                    <Home className="h-4 w-4 mr-2" />
                    Go to homepage
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <Link 
            href={returnUrl}
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

export default NoAccessPage