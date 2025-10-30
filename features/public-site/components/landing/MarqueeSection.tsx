"use client"

import { Marquee } from "@/components/ui/Marquee"
import { useQuery } from '@tanstack/react-query'
import { fetchAllCapabilities, fetchAllOpenSourceApps, fetchAllProprietaryApps } from '../../lib/data'

const MarqueeSection = () => {
  // Fetch all data for marquee using React Query
  const { data: capabilities } = useQuery({
    queryKey: ['all-capabilities'],
    queryFn: fetchAllCapabilities,
    staleTime: 5 * 60 * 1000,
  })

  const { data: openSourceApps } = useQuery({
    queryKey: ['all-open-source-apps'],
    queryFn: fetchAllOpenSourceApps,
    staleTime: 5 * 60 * 1000,
  })

  const { data: proprietaryApps } = useQuery({
    queryKey: ['all-proprietary-apps'],
    queryFn: fetchAllProprietaryApps,
    staleTime: 5 * 60 * 1000,
  })

  // Create separate marquee items for each row using real data
  const proprietaryItems = proprietaryApps?.slice(0, 10).map(app => ({
    text: app.name.toUpperCase(),
    href: `/alternatives/${app.slug}`
  })) || []

  const openSourceItems = openSourceApps?.slice(0, 10).map(app => ({
    text: app.name.toUpperCase(),
    href: `/os-alternatives/${app.slug}`
  })) || []

  const capabilityItems = capabilities?.slice(0, 10).map(cap => ({
    text: cap.name.toUpperCase(),
    href: `/capabilities/${cap.slug}`
  })) || []

  // Don't render marquee if no data is available
  if (!proprietaryItems.length && !openSourceItems.length && !capabilityItems.length) {
    return null
  }

  return (
    <div className="py-4">
      {/* Top row - Proprietary Apps - going left */}
      <Marquee
        items={proprietaryItems}
        repeat={3}
        duration={30}
        fontSize="lg"
        className="py-2"
        accentColor="blue"
      />

      {/* Middle row - Open Source Apps - going right */}
      <Marquee
        items={openSourceItems}
        repeat={3}
        duration={30}
        fontSize="lg"
        className="py-2"
        reverse={true}
        accentColor="green"
      />

      {/* Bottom row - Capabilities - going left */}
      <Marquee
        items={capabilityItems}
        repeat={3}
        duration={35}
        fontSize="lg"
        className="py-2"
        accentColor="orange"
      />
    </div>
  )
}

export default MarqueeSection