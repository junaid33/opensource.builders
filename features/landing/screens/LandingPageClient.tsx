'use client'

import { useState, ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Hero from '../components/Hero'
import ProprietarySoftware from '../components/ProprietarySoftware'
import Navbar from '@/components/ui/navbar'

interface LandingPageClientProps {
  initialSelectedSoftware: string
  sidebarSlot: ReactNode
  alternativesSlot: ReactNode
  proprietaryTools: Array<{id: string, name: string}>
}

export function LandingPageClient({ initialSelectedSoftware, sidebarSlot, alternativesSlot, proprietaryTools }: LandingPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedSoftware, setSelectedSoftware] = useState<string>(initialSelectedSoftware)

  const handleSoftwareSelect = (toolId: string, toolName: string) => {
    setSelectedSoftware(toolName)
    
    // Update URL with proprietary tool filter
    const params = new URLSearchParams(searchParams?.toString() || '')
    
    // Remove any existing proprietaryTool filters
    Array.from(params.keys()).forEach(key => {
      if (key.startsWith('!proprietaryTool_')) {
        params.delete(key)
      }
    })
    
    // Add the new proprietaryTool filter
    params.set('!proprietaryTool_is', JSON.stringify(toolId))
    
    const newUrl = `?${params.toString()}`
    router.push(newUrl, { scroll: false })
  }

  return (
    <>
      <Hero />
      <ProprietarySoftware onSoftwareSelect={handleSoftwareSelect} proprietaryTools={proprietaryTools} />

      {/* Page content */}
      <section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="py-8 md:py-16">
            <div className="md:flex md:justify-between" data-sticky-container>
              {sidebarSlot}

              {/* Main content */}
              <div className="md:grow">
                {alternativesSlot}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Built on Bolt Footer */}
      <footer className="py-8 border-t">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-row items-center justify-center gap-x-3">
            {/* Left crop line */}
            <div className="w-8 h-px bg-border"></div>
            
            <span className="text-sm text-muted-foreground">Built using</span>
            
            <a 
              href="https://bolt.new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block w-10 h-9 hover:opacity-80 transition-opacity text-foreground"
              style={{
                backgroundImage: `url("data:image/svg+xml;utf8,%3Csvg width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 51 21.9'%3E%3Cpath fill='currentColor' d='M24.1 19.3c-4.7 0-7-2.7-7-6.1s3.2-7.7 7.9-7.7 7 2.7 7 6.1-3.2 7.7-7.9 7.7Zm.2-4.3c1.6 0 2.7-1.5 2.7-3.1s-.8-2-2.2-2-2.7 1.5-2.7 3.1.8 2 2.2 2ZM37 19h-4.9l4-18.2H41l-4 18.1Z'/%3E%3Cpath fill='currentColor' d='M9.6 19.3c-1.5 0-3-.5-3.8-1.7L5.5 19 0 21.9.6 19 4.6.8h4.9L8.1 7.2c1.1-1.2 2.2-1.7 3.6-1.7 3 0 4.9 1.9 4.9 5.5s-2.3 8.3-7 8.3Zm1.9-7.3c0 1.7-1.2 3-2.8 3s-1.7-.3-2.2-.9l.8-3.3c.6-.6 1.2-.9 2-.9 1.2 0 2.2.9 2.2 2.2Z' fill-rule='evenodd' clip-rule='evenodd'/%3E%3Cpath fill='currentColor' d='M46.1 19.3c-2.8 0-4.9-1-4.9-3.3s0-.7.1-1l1.1-4.9h-2.2l1-4.2h2.2l.8-3.6L49.7 0l-.6 2.3-.8 3.6H51l-1 4.2h-2.7l-.7 3.2v.6c0 .6.4 1.1 1.2 1.1s.6 0 .7-.1v3.9c-.5.4-1.4.5-2.3.5Z'/%3E%3C/svg%3E")`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}
            />
            
            {/* Right crop line */}
            <div className="w-8 h-px bg-border"></div>
          </div>
        </div>
      </footer>
    </>
  )
}