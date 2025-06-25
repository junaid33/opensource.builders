import Hero from '../components/Hero'
import ProprietarySoftware from '../components/ProprietarySoftware'
import AlternativesList from '../components/AlternativesList'
import Sidebar from '../components/Sidebar'

export function LandingPage() {
  return (
    <>
      <Hero />
      <ProprietarySoftware />

      {/* Page content */}
      <section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="py-8 md:py-16">
            <div className="md:flex md:justify-between" data-sticky-container>
              <Sidebar />

              {/* Main content */}
              <div className="md:grow">
                <AlternativesList />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}