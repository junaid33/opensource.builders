'use client'

import { useState } from 'react'

export default function Sidebar() {
  const [openSourceOnly, setOpenSourceOnly] = useState<boolean>(true)

  return (
    <aside className="mb-8 md:mb-0 md:w-64 lg:w-72 md:ml-12 lg:ml-20 md:shrink-0 md:order-1">
      <div data-sticky="" data-margin-top="32" data-sticky-for="768" data-sticky-wrap="">
        <div className="relative bg-gray-50 rounded-xl border border-gray-200 p-5">
          <div className="absolute top-5 right-5 leading-none">
            <button className="text-sm font-medium text-blue-500 hover:underline">Clear</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
            {/* Group 1 */}
            <div>
              <div className="text-sm text-gray-800 font-semibold mb-3">Category</div>
              <ul className="space-y-2">
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="text-sm text-gray-600 ml-2">Development Tools</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="text-sm text-gray-600 ml-2">Project Management</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="text-sm text-gray-600 ml-2">Communication</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="text-sm text-gray-600 ml-2">Analytics</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="text-sm text-gray-600 ml-2">E-commerce</span>
                  </label>
                </li>
              </ul>
            </div>
            {/* Group 2 */}
            <div>
              <div className="text-sm text-gray-800 font-semibold mb-3">License Type</div>
              <ul className="space-y-2">
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox" defaultChecked />
                    <span className="text-sm text-gray-600 ml-2">MIT</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="text-sm text-gray-600 ml-2">Apache 2.0</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="text-sm text-gray-600 ml-2">GPL</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="text-sm text-gray-600 ml-2">BSD</span>
                  </label>
                </li>
              </ul>
            </div>
            {/* Group 3 */}
            <div>
              <div className="text-sm text-gray-800 font-semibold mb-3">Open Source Only</div>
              <div className="flex items-center">
                <div className="form-switch">
                  <input 
                    type="checkbox" 
                    id="opensource-toggle" 
                    className="sr-only" 
                    checked={openSourceOnly} 
                    onChange={() => setOpenSourceOnly(!openSourceOnly)} 
                  />
                  <label htmlFor="opensource-toggle">
                    <span className="bg-white shadow-xs" aria-hidden="true" />
                    <span className="sr-only">Open Source Only</span>
                  </label>
                </div>
                <div className="text-sm text-gray-400 italic ml-2">{openSourceOnly ? 'On' : 'Off'}</div>
              </div>
            </div>
            {/* Group 4 */}
            <div>
              <div className="text-sm text-gray-800 font-semibold mb-3">GitHub Stars</div>
              <ul className="space-y-2">
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="text-sm text-gray-600 ml-2">1K - 5K</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="text-sm text-gray-600 ml-2">5K - 10K</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="text-sm text-gray-600 ml-2">&gt; 10K</span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}