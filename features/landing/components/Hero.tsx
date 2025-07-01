import Link from 'next/link'
import Image from 'next/image'
import AnimatedText from './AnimatedText'
import { GitHubStarsButton } from './GitHubStarsButton'

interface HeroProps {
  proprietaryTools?: Array<{id: string, name: string}>
  onSoftwareSelect?: (toolId: string, toolName: string) => void
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
                    // Find the tool ID for the clicked word
                    const selectedTool = proprietaryTools?.find(tool => tool.name === word)
                    if (selectedTool && onSoftwareSelect) {
                      onSoftwareSelect(selectedTool.id, selectedTool.name)
                    }
                  }}
                />
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover powerful open source alternatives to popular proprietary software.
              <br className="hidden md:block" /> Save money, gain freedom, and support the open source community.
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
              <div className="sm:flex sm:items-center sm:justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="text-sm text-muted-foreground font-medium">
                  Trusted by <span className="text-primary">100K+</span> Developers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}