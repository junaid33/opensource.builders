import { LogoIcon as OpenFrontIcon } from "./OpenfrontLogo"
import { LogoIcon as OpenShipIcon } from "./OpenshipLogo"
import { LogoIcon as OpenSupportIcon } from "./OpensupportLogo"

interface CombinedLogoProps {
  className?: string
}

export function CombinedLogo({ className = "" }: CombinedLogoProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <OpenFrontIcon className="size-6" suffix="-navbar-front" />
      <OpenShipIcon className="size-6" suffix="-navbar-ship" />
      <OpenSupportIcon className="size-6" suffix="-navbar-support" />
    </div>
  )
}