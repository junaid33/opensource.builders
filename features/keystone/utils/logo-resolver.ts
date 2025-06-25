import crypto from 'crypto'

// Known MD5 hashes of Google's default globe icons
const GLOBE_ICON_HASHES = [
  '99fd8ddc4311471625e5756986002b6b', // Common globe hash
  'b8a0bf372c762e966cc99ede8682bc71', // Blank/default image hash
  '7c4e3eea2cd5a57b08b3e8d8f6e8b9c1', // Another common globe variant
]

interface LogoResult {
  type: 'svg' | 'url' | 'favicon' | 'letter'
  data: string
  domain?: string
  verified?: boolean
}

export async function resolveToolLogo(tool: {
  name: string
  logoSvg?: string
  logoUrl?: string
  websiteUrl?: string
}): Promise<LogoResult> {
  // 1. If we have a custom SVG, use it
  if (tool.logoSvg) {
    return {
      type: 'svg',
      data: tool.logoSvg,
      verified: true
    }
  }

  // 2. If we have a logoUrl, use it
  if (tool.logoUrl) {
    return {
      type: 'url',
      data: tool.logoUrl,
      verified: true
    }
  }

  // 3. Try favicon service with globe detection
  if (tool.websiteUrl) {
    try {
      const domain = new URL(tool.websiteUrl).hostname
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
      
      // Check if the favicon is the dreaded globe
      const isValidFavicon = await checkFaviconQuality(faviconUrl)
      
      if (isValidFavicon) {
        return {
          type: 'favicon',
          data: faviconUrl,
          domain: domain,
          verified: true
        }
      }
    } catch (error) {
      console.warn(`Failed to resolve favicon for ${tool.name}:`, error)
    }
  }

  // 4. Fallback to letter avatar
  const firstLetter = tool.name ? tool.name.charAt(0).toUpperCase() : '?'
  return {
    type: 'letter',
    data: firstLetter,
    verified: true
  }
}

async function checkFaviconQuality(faviconUrl: string): Promise<boolean> {
  try {
    const response = await fetch(faviconUrl, {
      method: 'HEAD',
      timeout: 5000, // 5 second timeout
    })

    if (!response.ok) {
      return false
    }

    // Try to get the actual image to check its dimensions and hash
    const imageResponse = await fetch(faviconUrl, {
      timeout: 5000,
    })

    if (!imageResponse.ok) {
      return false
    }

    const buffer = await imageResponse.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)

    // Check if it's too small (likely the default globe)
    if (buffer.byteLength < 200) { // Globe icons are typically very small
      return false
    }

    // Calculate MD5 hash to check against known globe hashes
    const hash = crypto.createHash('md5').update(uint8Array).digest('hex')
    
    if (GLOBE_ICON_HASHES.includes(hash)) {
      return false
    }

    // Additional check: if we requested size 64 but the image is still 16x16,
    // it's likely the default globe (this would require image processing to check)
    // For now, we'll rely on the hash and size checks above

    return true
  } catch (error) {
    // If we can't fetch or check the favicon, assume it's not good
    return false
  }
}

// Helper function to generate letter avatar SVG
export function generateLetterAvatarSvg(letter: string, size: number = 32): string {
  const colors = [
    '#3B82F6', // blue
    '#EF4444', // red
    '#10B981', // green
    '#F59E0B', // yellow
    '#8B5CF6', // purple
    '#06B6D4', // cyan
    '#F97316', // orange
    '#84CC16', // lime
  ]
  
  // Use letter charCode to pick consistent color
  const colorIndex = letter.charCodeAt(0) % colors.length
  const color = colors[colorIndex]
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${color}"/>
      <text x="${size/2}" y="${size/2}" dy="0.35em" text-anchor="middle" 
            fill="white" font-family="system-ui, sans-serif" 
            font-size="${size * 0.5}" font-weight="600">
        ${letter}
      </text>
    </svg>
  `.trim()
}