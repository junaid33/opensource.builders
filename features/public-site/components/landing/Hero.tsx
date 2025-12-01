import HeroAlternatives from './HeroAlternatives'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="pt-28 pb-8 md:pt-36 md:pb-16">
          {/* Hero content with alternatives preview */}
          <HeroAlternatives />
        </div>
      </div>
    </section>
  )
}