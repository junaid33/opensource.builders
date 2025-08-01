import Link from 'next/link'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'
import AnimatedText from './AnimatedText'
import { GitHubStarsButton } from './GitHubStarsButton'
import { Button } from '@/components/ui/button'

interface HeroProps {
  proprietaryTools?: Array<{id: string, name: string, slug: string}>
  onSoftwareSelect?: (toolSlug: string, toolName: string) => void
}

export default function Hero({ proprietaryTools = [], onSoftwareSelect }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="pt-28 pb-8 md:pt-36 md:pb-16">
          {/* Hero content */}
          <div className="max-w-2xl text-center md:text-left">
            {/* Copy */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Find open source alternatives to
              <br />
              <span className="font-geist-sans font-semibold">
                <AnimatedText 
                  onWordClick={(word) => {
                    // Find the tool slug for the clicked word
                    const selectedTool = proprietaryTools?.find(tool => tool.name === word)
                    if (selectedTool && onSoftwareSelect) {
                      onSoftwareSelect(selectedTool.slug, selectedTool.name)
                    }
                  }}
                />
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover powerful open source alternatives to popular proprietary software.
              <br className="hidden md:block" /> Take control of your software, gain freedom, and support the open source community.
            </p>
            {/* Button + Social proof */}
            <div className="sm:flex sm:items-center sm:justify-center md:justify-start space-y-6 sm:space-y-0 sm:space-x-5">
              <div>
                <GitHubStarsButton 
                  username="junaid33" 
                  repo="opensource.builders" 
                  // formatted={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}