interface ProgressiveBlurProps {
  direction?: 'left' | 'right'
  blurIntensity?: number
  className?: string
}

export function ProgressiveBlur({ 
  direction = 'left', 
  blurIntensity = 1,
  className = '' 
}: ProgressiveBlurProps) {
  const maskImage = direction === 'left' 
    ? `linear-gradient(to right, transparent, black ${blurIntensity * 100}%)`
    : `linear-gradient(to left, transparent, black ${blurIntensity * 100}%)`

  return (
    <div 
      className={`backdrop-blur-sm ${className}`}
      style={{
        maskImage,
        WebkitMaskImage: maskImage,
      }}
    />
  )
}