import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-100 to-white pointer-events-none -z-10" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-28 pb-8 md:pt-36 md:pb-16">
          {/* Hero content */}
          <div className="max-w-3xl text-center md:text-left">
            {/* Copy */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find open source alternatives to every <span className="font-handwriting text-blue-500 font-normal">software</span>
            </h1>
            <p className="text-lg text-gray-500 mb-8">
              Discover powerful open source alternatives to popular proprietary software.
              <br className="hidden md:block" /> Save money, gain freedom, and support the open source community.
            </p>
            {/* Button + Social proof */}
            <div className="sm:flex sm:items-center sm:justify-center md:justify-start space-y-6 sm:space-y-0 sm:space-x-5">
              <div>
                <Link className="inline-flex items-center justify-center px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg shadow-sm transition-colors" href="#alternatives">
                  Explore Alternatives
                </Link>
              </div>
              <div className="sm:flex sm:items-center sm:justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="text-sm text-gray-500 font-medium">
                  Trusted by <span className="text-blue-500">100K+</span> Developers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}