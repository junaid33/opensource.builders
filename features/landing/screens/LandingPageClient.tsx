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
    </>
  )
}