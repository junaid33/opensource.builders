import type { SelectedFeature, FeatureConflict, FeatureType } from '../types/build'

/**
 * Analyze selected features for potential conflicts and compatibility issues
 */
export function analyzeFeatureCompatibility(selectedFeatures: SelectedFeature[]): FeatureConflict[] {
  const conflicts: FeatureConflict[] = []

  // Check for authentication conflicts
  conflicts.push(...detectAuthenticationConflicts(selectedFeatures))
  
  // Check for database conflicts
  conflicts.push(...detectDatabaseConflicts(selectedFeatures))
  
  // Check for UI framework conflicts
  conflicts.push(...detectUIFrameworkConflicts(selectedFeatures))
  
  // Check for API conflicts
  conflicts.push(...detectAPIConflicts(selectedFeatures))
  
  // Check for performance conflicts
  conflicts.push(...detectPerformanceConflicts(selectedFeatures))

  return conflicts
}

/**
 * Detect authentication and security conflicts
 */
function detectAuthenticationConflicts(features: SelectedFeature[]): FeatureConflict[] {
  const conflicts: FeatureConflict[] = []
  
  // Find authentication-related features
  const authFeatures = features.filter(feature => 
    isAuthenticationFeature(feature.featureName) || 
    feature.featureType === 'security'
  )

  // Check for multiple auth systems
  if (authFeatures.length > 1) {
    for (let i = 0; i < authFeatures.length - 1; i++) {
      for (let j = i + 1; j < authFeatures.length; j++) {
        const feature1 = authFeatures[i]
        const feature2 = authFeatures[j]
        
        // If they're from different tools, likely incompatible
        if (feature1.toolId !== feature2.toolId) {
          conflicts.push({
            feature1,
            feature2,
            conflictType: 'incompatible',
            severity: 'warning',
            resolution: `Consider choosing between ${feature1.toolName}'s ${feature1.featureName} and ${feature2.toolName}'s ${feature2.featureName} to avoid authentication conflicts.`
          })
        }
      }
    }
  }

  return conflicts
}

/**
 * Detect database and storage conflicts
 */
function detectDatabaseConflicts(features: SelectedFeature[]): FeatureConflict[] {
  const conflicts: FeatureConflict[] = []
  
  const dbFeatures = features.filter(feature => 
    isDatabaseFeature(feature.featureName) ||
    feature.featureName.toLowerCase().includes('storage') ||
    feature.featureName.toLowerCase().includes('cache')
  )

  // Check for multiple database systems
  if (dbFeatures.length > 1) {
    const dbTypes = new Set(dbFeatures.map(f => getDatabaseType(f.featureName)))
    
    if (dbTypes.size > 1) {
      for (let i = 0; i < dbFeatures.length - 1; i++) {
        for (let j = i + 1; j < dbFeatures.length; j++) {
          const feature1 = dbFeatures[i]
          const feature2 = dbFeatures[j]
          
          if (getDatabaseType(feature1.featureName) !== getDatabaseType(feature2.featureName)) {
            conflicts.push({
              feature1,
              feature2,
              conflictType: 'incompatible',
              severity: 'error',
              resolution: 'Multiple database systems detected. Choose one primary database system for consistency.'
            })
          }
        }
      }
    }
  }

  return conflicts
}

/**
 * Detect UI framework and component conflicts
 */
function detectUIFrameworkConflicts(features: SelectedFeature[]): FeatureConflict[] {
  const conflicts: FeatureConflict[] = []
  
  const uiFeatures = features.filter(feature => 
    feature.featureType === 'ui_ux' ||
    isUIFrameworkFeature(feature.featureName)
  )

  // Check for CSS framework conflicts
  const cssFrameworks = uiFeatures.filter(feature => 
    isCSSFramework(feature.featureName)
  )

  if (cssFrameworks.length > 1) {
    for (let i = 0; i < cssFrameworks.length - 1; i++) {
      for (let j = i + 1; j < cssFrameworks.length; j++) {
        conflicts.push({
          feature1: cssFrameworks[i],
          feature2: cssFrameworks[j],
          conflictType: 'incompatible',
          severity: 'warning',
          resolution: 'Multiple CSS frameworks may cause styling conflicts. Consider using only one.'
        })
      }
    }
  }

  return conflicts
}

/**
 * Detect API and integration conflicts
 */
function detectAPIConflicts(features: SelectedFeature[]): FeatureConflict[] {
  const conflicts: FeatureConflict[] = []
  
  const apiFeatures = features.filter(feature => 
    feature.featureType === 'api' ||
    feature.featureType === 'integration'
  )

  // Check for duplicate API functionality
  const apiGroups = groupAPIFeatures(apiFeatures)
  
  Object.entries(apiGroups).forEach(([apiType, featuresGroup]) => {
    if (featuresGroup.length > 1) {
      for (let i = 0; i < featuresGroup.length - 1; i++) {
        for (let j = i + 1; j < featuresGroup.length; j++) {
          conflicts.push({
            feature1: featuresGroup[i],
            feature2: featuresGroup[j],
            conflictType: 'overlapping',
            severity: 'warning',
            resolution: `Both features provide ${apiType} functionality. Consider if both are needed or if one can handle both use cases.`
          })
        }
      }
    }
  })

  return conflicts
}

/**
 * Detect performance-related conflicts
 */
function detectPerformanceConflicts(features: SelectedFeature[]): FeatureConflict[] {
  const conflicts: FeatureConflict[] = []
  
  // Check for too many heavy features
  const heavyFeatures = features.filter(feature => 
    isHeavyFeature(feature.featureName) ||
    feature.featureType === 'performance'
  )

  if (heavyFeatures.length > 3) {
    conflicts.push({
      feature1: heavyFeatures[0],
      feature2: heavyFeatures[heavyFeatures.length - 1],
      conflictType: 'overlapping',
      severity: 'warning',
      resolution: `You've selected ${heavyFeatures.length} performance-intensive features. Consider if all are necessary to avoid bundle size issues.`
    })
  }

  return conflicts
}

/**
 * Check if a feature is authentication-related
 */
function isAuthenticationFeature(featureName: string): boolean {
  const authKeywords = [
    'auth', 'login', 'signin', 'signup', 'oauth', 'jwt', 'session',
    'passport', 'supabase auth', 'firebase auth', 'auth0', 'clerk'
  ]
  
  const lowerName = featureName.toLowerCase()
  return authKeywords.some(keyword => lowerName.includes(keyword))
}

/**
 * Check if a feature is database-related
 */
function isDatabaseFeature(featureName: string): boolean {
  const dbKeywords = [
    'database', 'prisma', 'mongoose', 'sequelize', 'typeorm',
    'postgres', 'mysql', 'mongodb', 'redis', 'sqlite'
  ]
  
  const lowerName = featureName.toLowerCase()
  return dbKeywords.some(keyword => lowerName.includes(keyword))
}

/**
 * Get database type from feature name
 */
function getDatabaseType(featureName: string): string {
  const lowerName = featureName.toLowerCase()
  
  if (lowerName.includes('postgres') || lowerName.includes('postgresql')) return 'postgresql'
  if (lowerName.includes('mysql')) return 'mysql'
  if (lowerName.includes('mongodb') || lowerName.includes('mongo')) return 'mongodb'
  if (lowerName.includes('redis')) return 'redis'
  if (lowerName.includes('sqlite')) return 'sqlite'
  if (lowerName.includes('prisma')) return 'prisma' // ORM, not DB type
  
  return 'unknown'
}

/**
 * Check if a feature is UI framework-related
 */
function isUIFrameworkFeature(featureName: string): boolean {
  const uiKeywords = [
    'component', 'ui', 'design system', 'theme', 'styling',
    'css', 'tailwind', 'bootstrap', 'material', 'chakra'
  ]
  
  const lowerName = featureName.toLowerCase()
  return uiKeywords.some(keyword => lowerName.includes(keyword))
}

/**
 * Check if a feature is a CSS framework
 */
function isCSSFramework(featureName: string): boolean {
  const cssFrameworks = [
    'tailwind', 'bootstrap', 'material-ui', 'chakra', 'bulma',
    'foundation', 'semantic ui', 'ant design'
  ]
  
  const lowerName = featureName.toLowerCase()
  return cssFrameworks.some(framework => lowerName.includes(framework))
}

/**
 * Check if a feature is performance-intensive
 */
function isHeavyFeature(featureName: string): boolean {
  const heavyKeywords = [
    'analytics', 'tracking', 'monitoring', 'real-time', 'websocket',
    'video', 'image processing', 'ai', 'machine learning', 'chart'
  ]
  
  const lowerName = featureName.toLowerCase()
  return heavyKeywords.some(keyword => lowerName.includes(keyword))
}

/**
 * Group API features by functionality type
 */
function groupAPIFeatures(apiFeatures: SelectedFeature[]): Record<string, SelectedFeature[]> {
  const groups: Record<string, SelectedFeature[]> = {}
  
  apiFeatures.forEach(feature => {
    const apiType = getAPIType(feature.featureName)
    if (!groups[apiType]) {
      groups[apiType] = []
    }
    groups[apiType].push(feature)
  })
  
  return groups
}

/**
 * Determine API type from feature name
 */
function getAPIType(featureName: string): string {
  const lowerName = featureName.toLowerCase()
  
  if (lowerName.includes('payment') || lowerName.includes('stripe') || lowerName.includes('paypal')) {
    return 'payment'
  }
  if (lowerName.includes('email') || lowerName.includes('mail') || lowerName.includes('sendgrid')) {
    return 'email'
  }
  if (lowerName.includes('storage') || lowerName.includes('upload') || lowerName.includes('s3')) {
    return 'storage'
  }
  if (lowerName.includes('search') || lowerName.includes('elasticsearch') || lowerName.includes('algolia')) {
    return 'search'
  }
  if (lowerName.includes('notification') || lowerName.includes('push') || lowerName.includes('sms')) {
    return 'notification'
  }
  
  return 'general'
}

/**
 * Get severity color for UI display
 */
export function getConflictSeverityColor(severity: FeatureConflict['severity']): string {
  switch (severity) {
    case 'error':
      return 'text-destructive border-destructive bg-destructive/10'
    case 'warning':
      return 'text-orange-600 border-orange-200 bg-orange-50'
    default:
      return 'text-muted-foreground border-muted bg-muted/50'
  }
}

/**
 * Get conflict type icon
 */
export function getConflictTypeIcon(conflictType: FeatureConflict['conflictType']): string {
  switch (conflictType) {
    case 'incompatible':
      return '⚠️'
    case 'overlapping':
      return '🔄'
    case 'dependency':
      return '🔗'
    default:
      return 'ℹ️'
  }
}

/**
 * Calculate compatibility score for selected features
 */
export function calculateCompatibilityScore(features: SelectedFeature[]): {
  score: number
  maxScore: number
  conflicts: FeatureConflict[]
} {
  const conflicts = analyzeFeatureCompatibility(features)
  
  const maxScore = features.length * 10 // Perfect score would be 10 per feature
  const penalties = conflicts.reduce((total, conflict) => {
    switch (conflict.severity) {
      case 'error':
        return total + 5
      case 'warning':
        return total + 2
      default:
        return total + 1
    }
  }, 0)
  
  const score = Math.max(0, maxScore - penalties)
  
  return {
    score,
    maxScore,
    conflicts
  }
}