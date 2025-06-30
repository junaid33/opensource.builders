import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

export default function ToolNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tool Not Found</h1>
            <p className="text-gray-600 text-lg">
              The tool you're looking for doesn't exist or may have been removed.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What you can do:</h2>
            <ul className="text-left space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 shrink-0"></span>
                Check the URL for typos
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 shrink-0"></span>
                Browse our directory to find similar tools
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 shrink-0"></span>
                Use the search and filters to discover new tools
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Link 
              href="/" 
              className="inline-flex items-center px-6 py-3 text-white bg-gray-900 border border-transparent rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Directory
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}