import React from 'react'
import { DisplayCard } from './AlternativeCard'
import type { OpenSourceApplication as OpenSourceAlternative, Capability } from '../../types'

interface EventsSectionProps {
  alternatives: OpenSourceAlternative[];
  proprietaryCapabilities: Capability[];
  title?: string;
}

export function EventsSection({ alternatives, proprietaryCapabilities, title = "Open Source Alternatives" }: EventsSectionProps) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>
      
      {alternatives.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No open source alternatives found yet.</p>
          <p className="text-gray-500 text-sm mt-2">Be the first to submit one!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {alternatives.map((alternative) => {
            // Only calculate compatibility if alternative has capabilities (not for capabilities pages)
            let compatibilityScore = 100; // Default to 100% for capabilities pages
            let matchingCapabilities: any[] = [];
            let extraCapabilitiesCount = 0;

            if (alternative.capabilities) {
              const proprietaryCapIds = proprietaryCapabilities.map(c => c.id)
              matchingCapabilities = alternative.capabilities.filter(oc =>
                proprietaryCapIds.includes(oc.capability.id)
              )
              const matchingCount = matchingCapabilities.length
              const totalCount = proprietaryCapabilities.length
              compatibilityScore = totalCount > 0 ? Math.round((matchingCount / totalCount) * 100) : 0

              // Calculate extra capabilities (OS app has MORE than proprietary app)
              const totalOSCapabilities = alternative.capabilities.length
              extraCapabilitiesCount = totalOSCapabilities - totalCount
              if (extraCapabilitiesCount < 0) extraCapabilitiesCount = 0
            }

            // Build capabilities array: proprietary caps + extra OS caps
            const allCapabilities = [
              // Proprietary capabilities (with compatible flag)
              ...proprietaryCapabilities.map(proprietary => {
                const openSourceHasThis = alternative.capabilities?.find(oc =>
                  oc.capability.id === proprietary.id
                )
                return {
                  name: proprietary.name,
                  compatible: alternative.capabilities ? !!openSourceHasThis : true,
                  category: proprietary.category,
                  complexity: proprietary.complexity,
                  isExtra: false
                }
              }),
              // Extra OS capabilities (not in proprietary list)
              ...(alternative.capabilities?.filter(oc =>
                !proprietaryCapabilities.find(p => p.id === oc.capability.id)
              ).map(oc => ({
                name: oc.capability.name,
                compatible: true,
                category: oc.capability.category,
                complexity: oc.capability.complexity,
                isExtra: true
              })) || [])
            ]

            return (
              <DisplayCard
                key={alternative.id}
                name={alternative.name}
                description={alternative.description}
                websiteUrl={alternative.websiteUrl}
                repositoryUrl={alternative.repositoryUrl}
                simpleIconSlug={alternative.simpleIconSlug}
                simpleIconColor={alternative.simpleIconColor}
                license={alternative.license}
                githubStars={alternative.githubStars}
                isOpenSource={true}
                capabilities={allCapabilities}
                totalCapabilities={proprietaryCapabilities.length}
                compatibilityScore={compatibilityScore}
                extraCapabilitiesCount={extraCapabilitiesCount}
                alternatives={[]}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}