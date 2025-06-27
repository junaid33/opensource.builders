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
}

export function LandingPageClient({ initialSelectedSoftware, sidebarSlot, alternativesSlot }: LandingPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedSoftware, setSelectedSoftware] = useState<string>(initialSelectedSoftware)

  const handleSoftwareSelect = (software: string) => {
    setSelectedSoftware(software)
    
    // Update URL with selected software
    const params = new URLSearchParams(searchParams?.toString() || '')
    if (software !== 'Shopify') {
      params.set('software', software)
    } else {
      params.delete('software')
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : '/'
    router.push(newUrl, { scroll: false })
  }

  return (
    <>
      <Hero />
      <ProprietarySoftware onSoftwareSelect={handleSoftwareSelect} />

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