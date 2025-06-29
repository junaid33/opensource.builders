'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Code, Zap, Rocket, Star, ExternalLink, Github } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { BuildWizard } from '../components/BuildWizard'
import { ToolSelector } from '../components/ToolSelector'
import { FeatureSelector } from '../components/FeatureSelector'
import { PromptOutput } from '../components/PromptOutput'
import { ProgressTracker } from '../components/ProgressTracker'
import type { BuildState, BuildWizardStep, Tool, SelectedFeature, FeatureConflict } from '../types/build'
import { cn } from '@/lib/utils'

interface BuildPageProps {
  initialTools: Tool[]
  initialCategories: any[]
}

// Mock template data
const templates = [
  { id: 'saas', name: 'SaaS Platform', description: 'Full-featured SaaS application with auth, billing, and admin' },
  { id: 'ecommerce', name: 'E-commerce Store', description: 'Complete online store with cart, payments, and inventory' },
  { id: 'blog', name: 'Blog & CMS', description: 'Content management system with blog and publishing features' },
  { id: 'dashboard', name: 'Analytics Dashboard', description: 'Data visualization and analytics platform' },
  { id: 'marketplace', name: 'Marketplace', description: 'Multi-vendor marketplace with vendor management' },
]

// Mock applications built with templates
const mockApplications = {
  saas: [
    {
      id: '1',
      name: 'TaskFlow Pro',
      description: 'Project management and team collaboration platform built with Next.js and Supabase',
      stars: 1200,
      url: 'https://taskflow.example.com',
      github: 'https://github.com/example/taskflow',
      tools: ['Next.js', 'Supabase', 'Stripe', 'Tailwind CSS'],
      image: '/api/placeholder/400/200'
    },
    {
      id: '2', 
      name: 'InvoiceHub',
      description: 'Invoice and billing management SaaS with automated workflows',
      stars: 890,
      url: 'https://invoicehub.example.com',
      github: 'https://github.com/example/invoicehub',
      tools: ['Next.js', 'Prisma', 'Stripe', 'Resend'],
      image: '/api/placeholder/400/200'
    }
  ],
  ecommerce: [
    {
      id: '3',
      name: 'EcoStore',
      description: 'Sustainable products marketplace with carbon footprint tracking',
      stars: 2100,
      url: 'https://ecostore.example.com',
      github: 'https://github.com/example/ecostore',
      tools: ['Next.js', 'Medusa', 'Stripe', 'Algolia'],
      image: '/api/placeholder/400/200'
    }
  ],
  blog: [
    {
      id: '4',
      name: 'DevBlog',
      description: 'Technical blog platform with syntax highlighting and newsletter',
      stars: 650,
      url: 'https://devblog.example.com', 
      github: 'https://github.com/example/devblog',
      tools: ['Next.js', 'Sanity', 'MDX', 'Mailchimp'],
      image: '/api/placeholder/400/200'
    }
  ],
  dashboard: [
    {
      id: '5',
      name: 'MetricsView',
      description: 'Business intelligence dashboard with real-time analytics',
      stars: 1500,
      url: 'https://metricsview.example.com',
      github: 'https://github.com/example/metricsview', 
      tools: ['Next.js', 'Supabase', 'Chart.js', 'WebSockets'],
      image: '/api/placeholder/400/200'
    }
  ],
  marketplace: [
    {
      id: '6',
      name: 'ArtisanMarket',
      description: 'Handmade goods marketplace with vendor onboarding',
      stars: 980,
      url: 'https://artisanmarket.example.com',
      github: 'https://github.com/example/artisanmarket',
      tools: ['Next.js', 'Supabase', 'Stripe Connect', 'Cloudinary'],
      image: '/api/placeholder/400/200'
    }
  ]
}

export function BuildPage({ initialTools, initialCategories }: BuildPageProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [buildState, setBuildState] = useState<BuildState>({
    currentStep: 'tools',
    selectedTools: [],
    selectedFeatures: [],
    conflicts: [],
    prompt: '',
    isComplete: false
  })

  const currentApplications = selectedTemplate ? mockApplications[selectedTemplate as keyof typeof mockApplications] || [] : []

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white">
      <section className="py-32">
        <div className="mx-auto max-w-4xl px-4 lg:px-0">
          <motion.h1 
            className="mb-12 text-center text-4xl font-semibold lg:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Build Your Next Project
          </motion.h1>
<div className="bg-white">
          {/* Process Explanation */}
          <div className="grid divide-y border md:grid-cols-2 md:gap-4 md:divide-x md:divide-y-0">
            <div className="flex flex-col justify-between space-y-8 p-6 sm:p-12">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Code className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold">Leverage Open Source</h2>
                </div>
                <p className="text-gray-600">
                  Let AI learn features and flows from open source projects and build your project faster.
                </p>
                {/* <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">Next.js</span>
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">Supabase</span>
                  <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">Tailwind</span>
                </div> */}
              </div>
            </div>
            <div className="flex flex-col justify-between space-y-8 p-6 sm:p-12">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold">No Chats, No Editor, Just a Prompt</h3>
                </div>
                <p className="text-gray-600">
                  Use Cursor, Claude Code, Gemini, or any other AI code editor to build your project.
                </p>
                {/* <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded">Setup Guide</span>
                  <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded">Code Examples</span>
                  <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded">Best Practices</span>
                </div> */}
              </div>
            </div>
          </div>

          {/* Template Selection */}
          <div className="h-3 border-x bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)]"></div>
          </div>
          <form
            action=""
            className="border px-4 py-12 lg:px-0 lg:py-24">
            <Card className="mx-auto max-w-lg p-8 sm:p-16">
              <h3 className="text-xl font-semibold">Let's get you to the right place</h3>
              <p className="mt-4 text-sm">Reach out to our sales team! We're eager to learn more about how you plan to use our application.</p>

              <div className="mt-12">
                <Button>Submit</Button>
              </div>
            </Card>
          </form>

          {/* Applications Built with Selected Template */}
          {selectedTemplate && currentApplications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-12"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold mb-2">
                  Applications Built with {templates.find(t => t.id === selectedTemplate)?.name}
                </h3>
                <p className="text-gray-600">
                  See what others have built using this template
                </p>
              </div>

              <div className="grid gap-6">
                {currentApplications.map(app => (
                  <Card key={app.id} className="group relative overflow-hidden border border-border bg-background p-6 transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* App Icon/Image Placeholder */}
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {app.name.charAt(0)}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                              {app.name}
                            </h4>
                            {app.stars > 0 && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Star className="w-4 h-4" />
                                <span>{app.stars.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                            {app.description}
                          </p>
                          
                          {/* Tech Stack */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {app.tools.map((tool, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {app.url && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 hover:bg-muted/50"
                            asChild
                          >
                            <a
                              href={app.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            </a>
                          </Button>
                        )}
                        {app.github && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 hover:bg-muted/50"
                            asChild
                          >
                            <a
                              href={app.github}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github className="w-4 h-4 text-muted-foreground" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Original Tool Selection */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold mb-2">Or Build from Scratch</h3>
              <p className="text-gray-600">
                Select individual tools and features to create a custom project
              </p>
            </div>

            <ToolSelector
              selectedTools={buildState.selectedTools}
              onToolsSelect={(tools) => setBuildState(prev => ({ ...prev, selectedTools: tools }))}
              initialTools={initialTools}
              initialCategories={initialCategories}
            />

            {buildState.selectedTools.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-12"
              >
                                 <FeatureSelector
                   selectedTools={buildState.selectedTools}
                   selectedFeatures={buildState.selectedFeatures}
                   onFeaturesSelect={(features) => setBuildState(prev => ({ ...prev, selectedFeatures: features }))}
                   onConflictsDetected={(conflicts) => setBuildState(prev => ({ ...prev, conflicts }))}
                 />
              </motion.div>
            )}

            {buildState.selectedFeatures.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-12"
              >
                                 <PromptOutput
                   selectedTools={buildState.selectedTools}
                   selectedFeatures={buildState.selectedFeatures}
                   conflicts={buildState.conflicts}
                 />
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default BuildPage