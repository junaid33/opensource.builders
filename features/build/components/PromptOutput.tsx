'use client'

import { useState, useEffect } from 'react'
import { Copy, Download, BookOpen, Check, Loader2, ExternalLink, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { generatePrompt, getPromptStats } from '../actions/generatePrompt'
import { cn } from '@/lib/utils'
import type { Tool, SelectedFeature, FeatureConflict, GeneratedPrompt } from '../types/build'

interface PromptOutputProps {
  selectedTools: Tool[]
  selectedFeatures: SelectedFeature[]
  conflicts: FeatureConflict[]
  className?: string
}

interface PromptStats {
  toolCount: number
  featureCount: number
  estimatedReadTime: number
  wordCount: number
  characterCount: number
  implementationSteps: number
  resourceCount: number
}

export function PromptOutput({
  selectedTools,
  selectedFeatures,
  conflicts,
  className
}: PromptOutputProps) {
  const [prompt, setPrompt] = useState<GeneratedPrompt | null>(null)
  const [stats, setStats] = useState<PromptStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

  // Generate prompt when component mounts or selections change
  useEffect(() => {
    async function generatePromptData() {
      if (selectedTools.length === 0 || selectedFeatures.length === 0) {
        setPrompt(null)
        setStats(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const [promptResult, statsResult] = await Promise.all([
          generatePrompt(selectedTools, selectedFeatures),
          getPromptStats(selectedTools, selectedFeatures)
        ])

        if (!promptResult.success) {
          throw new Error(promptResult.error || 'Failed to generate prompt')
        }

        if (!statsResult.success) {
          throw new Error(statsResult.error || 'Failed to generate stats')
        }

        setPrompt(promptResult.data!)
        setStats(statsResult.data)

      } catch (err) {
        console.error('Error generating prompt:', err)
        setError(err instanceof Error ? err.message : 'Failed to generate prompt')
      } finally {
        setLoading(false)
      }
    }

    generatePromptData()
  }, [selectedTools, selectedFeatures])

  const handleCopyPrompt = async () => {
    if (!prompt) return

    try {
      await navigator.clipboard.writeText(prompt.fullPrompt)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = prompt.fullPrompt
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  if (selectedTools.length === 0 || selectedFeatures.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          Please select tools and features to generate your implementation prompt
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>
          ← Back to Feature Selection
        </Button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <div className="text-destructive mb-4">
          Failed to generate prompt: {error}
        </div>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Summary Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-3/4" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardDescription>Project Summary</CardDescription>
              <CardTitle>
                {stats?.toolCount} Tools, {stats?.featureCount} Features
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardDescription>Implementation Guide</CardDescription>
              <CardTitle>
                {stats?.implementationSteps} Steps
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardDescription>Estimated Read Time</CardDescription>
              <CardTitle>
                {stats?.estimatedReadTime} minutes
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Conflicts Warning */}
      {conflicts.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Potential Conflicts Detected:</strong>
            <ul className="mt-2 space-y-1">
              {conflicts.map((conflict, index) => (
                <li key={index} className="text-sm">
                  • {conflict.feature1.featureName} and {conflict.feature2.featureName} may conflict
                  {conflict.resolution && (
                    <div className="text-xs text-muted-foreground ml-2">
                      {conflict.resolution}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="prompt" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prompt" className="flex items-center space-x-2">
            <Copy className="w-4 h-4" />
            <span>Generated Prompt</span>
          </TabsTrigger>
          <TabsTrigger value="download" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download Starter</span>
          </TabsTrigger>
          <TabsTrigger value="instructions" className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>How to Use</span>
          </TabsTrigger>
        </TabsList>

        {/* Prompt Tab */}
        <TabsContent value="prompt" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Implementation Prompt</CardTitle>
                  <CardDescription>
                    Copy this prompt and use it with your preferred AI coding assistant
                  </CardDescription>
                </div>
                <Button onClick={handleCopyPrompt} disabled={!prompt}>
                  {copySuccess ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Prompt
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {stats?.wordCount.toLocaleString()} words
                    </Badge>
                    <Badge variant="secondary">
                      {stats?.characterCount.toLocaleString()} characters
                    </Badge>
                    <Badge variant="secondary">
                      {stats?.resourceCount} resources
                    </Badge>
                  </div>
                  
                  <Textarea
                    value={prompt?.fullPrompt || ''}
                    readOnly
                    className="min-h-96 font-mono text-sm"
                    placeholder="Your prompt will appear here..."
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Download Tab */}
        <TabsContent value="download" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Next.js/Keystone Starter Template</CardTitle>
              <CardDescription>
                Download the foundation template that your features will be built upon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">What's Included:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Next.js 15 with App Router</li>
                  <li>• Keystone.js 6 for backend and admin</li>
                  <li>• Prisma for database management</li>
                  <li>• Tailwind CSS + shadcn/ui components</li>
                  <li>• TypeScript configuration</li>
                  <li>• GraphQL API setup</li>
                  <li>• Authentication system</li>
                  <li>• Feature-slice architecture</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <Button asChild className="flex-1">
                  <a
                    href="https://github.com/opensource-builders/nextjs-keystone-starter/archive/refs/heads/main.zip"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download ZIP
                  </a>
                </Button>
                
                <Button variant="outline" asChild>
                  <a
                    href="https://github.com/opensource-builders/nextjs-keystone-starter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on GitHub
                  </a>
                </Button>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  After downloading, extract the files and run <code className="bg-muted px-1 rounded">npm install</code> to install dependencies.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Instructions Tab */}
        <TabsContent value="instructions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>How to Use Your Generated Prompt</CardTitle>
              <CardDescription>
                Step-by-step guide to implement your selected features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-medium">Step 1: Get the Foundation</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Download the Next.js/Keystone starter template and set it up locally.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-medium">Step 2: Copy Your Prompt</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Copy the generated prompt from the "Generated Prompt" tab.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-medium">Step 3: Choose Your AI Assistant</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Use the prompt with any AI coding assistant of your choice.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-medium">Step 4: Implement Features</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Follow the AI's guidance to implement your selected features step by step.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Recommended AI Tools:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border rounded-lg p-3">
                    <div className="font-medium">Cursor</div>
                    <div className="text-xs text-muted-foreground">
                      AI-powered code editor with excellent codebase understanding
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="font-medium">Claude (Anthropic)</div>
                    <div className="text-xs text-muted-foreground">
                      Great for complex code analysis and architecture decisions
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="font-medium">GitHub Copilot</div>
                    <div className="text-xs text-muted-foreground">
                      Excellent for code completion and implementation details
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="font-medium">ChatGPT</div>
                    <div className="text-xs text-muted-foreground">
                      Good for step-by-step guidance and explanations
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Pro Tip:</strong> Start with the highest quality score features first, 
                  as they tend to be better documented and easier to implement.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Selected Features Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Selected Features Summary</CardTitle>
          <CardDescription>
            Review what you've selected to implement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedTools.map(tool => {
              const toolFeatures = selectedFeatures.filter(f => f.toolId === tool.id)
              
              if (toolFeatures.length === 0) return null
              
              return (
                <div key={tool.id} className="border-l-2 border-primary/20 pl-4">
                  <div className="font-medium">{tool.name}</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {toolFeatures.length} features selected
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {toolFeatures.map(feature => (
                      <Badge key={`${feature.toolId}-${feature.featureId}`} variant="outline">
                        {feature.featureName}
                        {feature.qualityScore && (
                          <span className="ml-1 text-xs">({feature.qualityScore}/10)</span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}