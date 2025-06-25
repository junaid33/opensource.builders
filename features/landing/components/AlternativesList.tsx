import { Suspense } from 'react'
import AlternativeCard from './AlternativeCard'
import AlternativesQuery from './AlternativesQuery'

export default function AlternativesList() {
  return (
    <div className="pb-8 md:pb-16" id="alternatives">
      <h2 className="text-3xl font-bold mb-10">Open Source Alternatives</h2>
      
      <Suspense fallback={<AlternativesLoading />}>
        <AlternativesQuery />
      </Suspense>
    </div>
  )
}

function AlternativesLoading() {
  return (
    <div className="space-y-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border-b border-gray-200 pb-6">
          <div className="animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}