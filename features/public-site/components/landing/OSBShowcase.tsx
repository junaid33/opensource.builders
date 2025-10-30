'use client'

import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider'
import { ProgressiveBlur } from '@/components/motion-primitives/progressive-blur'
import ToolIcon from '@/components/ToolIcon'
import { useAllCapabilities, useAllOpenSourceApps } from '../../lib/hooks'


export default function OSBShowcase() {
  const { data: capabilities, isLoading: capabilitiesLoading } = useAllCapabilities()
  const { data: openSourceApps, isLoading: openSourceLoading } = useAllOpenSourceApps()

  return (
    <div className="bg-background space-y-16 md:space-y-32 py-16 md:py-32">

      {/* Capabilities Section */}
      <section className="bg-background pb-16 md:pb-32">
        <div className="group relative m-auto max-w-6xl px-6">
          <div className="flex flex-col items-center md:flex-row">
            <div className="md:max-w-44 md:border-r md:pr-6">
              <p className="text-end text-sm">Popular capabilities</p>
            </div>
            <div className="relative py-6 md:w-[calc(100%-11rem)]">
              {capabilitiesLoading ? (
                <div className="flex items-center justify-center h-16">
                  <div className="text-sm text-muted-foreground">Loading...</div>
                </div>
              ) : (
                <InfiniteSlider
                  speedOnHover={20}
                  speed={40}
                  gap={112}>
                  {capabilities?.map((capability) => (
                    <div key={capability.id} className="flex items-center gap-3">
                      <ToolIcon
                        name={capability.name}
                        simpleIconSlug={null}
                        simpleIconColor="#000000"
                        size={32}
                      />
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">
                        {capability.name}
                      </span>
                    </div>
                  ))}
                </InfiniteSlider>
              )}

              <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
              <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
              <ProgressiveBlur
                className="pointer-events-none absolute left-0 top-0 h-full w-20"
                direction="left"
                blurIntensity={1}
              />
              <ProgressiveBlur
                className="pointer-events-none absolute right-0 top-0 h-full w-20"
                direction="right"
                blurIntensity={1}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Applications Section */}
      <section className="bg-background pb-16 md:pb-32">
        <div className="group relative m-auto max-w-6xl px-6">
          <div className="flex flex-col items-center md:flex-row">
            <div className="md:max-w-44 md:border-r md:pr-6">
              <p className="text-end text-sm">Featured open source apps</p>
            </div>
            <div className="relative py-6 md:w-[calc(100%-11rem)]">
              {openSourceLoading ? (
                <div className="flex items-center justify-center h-16">
                  <div className="text-sm text-muted-foreground">Loading...</div>
                </div>
              ) : (
                <InfiniteSlider
                  speedOnHover={20}
                  speed={40}
                  gap={112}>
                  {openSourceApps?.map((app) => (
                    <div key={app.id} className="flex items-center gap-3">
                      <ToolIcon
                        name={app.name}
                        simpleIconSlug={app.simpleIconSlug}
                        simpleIconColor={app.simpleIconColor}
                        size={32}
                      />
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">
                        {app.name}
                      </span>
                    </div>
                  ))}
                </InfiniteSlider>
              )}

              <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
              <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
              <ProgressiveBlur
                className="pointer-events-none absolute left-0 top-0 h-full w-20"
                direction="left"
                blurIntensity={1}
              />
              <ProgressiveBlur
                className="pointer-events-none absolute right-0 top-0 h-full w-20"
                direction="right"
                blurIntensity={1}
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}