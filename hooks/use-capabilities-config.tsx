"use client"

import * as React from "react"

interface SelectedCapability {
  id: string // composite key: toolId-capabilityId
  capabilityId: string
  toolId: string
  name: string
  description?: string
  category?: string
  complexity?: string
  toolName: string
  toolIcon?: string
  toolColor?: string
  toolRepo?: string
  implementationNotes?: string
  githubPath?: string
  documentationUrl?: string
}

interface CapabilitiesConfig {
  selectedCapabilities: SelectedCapability[]
  lastPinnedToolId?: string // Track the last tool that had a capability pinned
  buildStatsCard: {
    currentAppId?: string // ID of the currently selected app (more robust than index)
    isCollapsed: boolean
    capabilitySearch: string
    appSearchTerm: string
    isAppsDropdownOpen: boolean
  }
}

interface CapabilitiesProviderProps {
  children: React.ReactNode
  storageKey?: string
}

interface CapabilitiesProviderState {
  config: CapabilitiesConfig
  setConfig: (config: Partial<CapabilitiesConfig> | ((prev: CapabilitiesConfig) => Partial<CapabilitiesConfig>)) => void
  addCapability: (capability: SelectedCapability) => void
  removeCapability: (capabilityId: string) => void
  isHydrated: boolean
}

const isServer = typeof window === "undefined"
const CapabilitiesContext = React.createContext<CapabilitiesProviderState | undefined>(
  undefined
)

const defaultCapabilitiesConfig: CapabilitiesConfig = {
  selectedCapabilities: [],
  lastPinnedToolId: undefined,
  buildStatsCard: {
    currentAppId: undefined,
    isCollapsed: false,
    capabilitySearch: '',
    appSearchTerm: '',
    isAppsDropdownOpen: false,
  }
}

const saveToLS = (storageKey: string, config: CapabilitiesConfig) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(config))
  } catch {
    // Unsupported
  }
}

const loadFromLS = (storageKey: string, defaultConfig: CapabilitiesConfig): CapabilitiesConfig => {
  if (isServer) return defaultConfig

  try {
    const savedConfig = localStorage.getItem(storageKey)
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig) as CapabilitiesConfig
      return {
        ...defaultConfig,
        ...parsed,
        // Always reset these UI states on page load - they should never be persisted
        buildStatsCard: {
          ...parsed.buildStatsCard,
          currentAppId: undefined, // Always start with first app (will default to index 0)
          isAppsDropdownOpen: false, // Always start closed
          appSearchTerm: '', // Clear search
        }
      }
    }

    return defaultConfig
  } catch {
    return defaultConfig
  }
}

const useCapabilitiesConfig = () => {
  const context = React.useContext(CapabilitiesContext)
  if (context === undefined) {
    throw new Error("useCapabilitiesConfig must be used within a CapabilitiesProvider")
  }
  return context
}

const CapabilitiesRoot = ({
  storageKey = "capabilities-config",
  children,
}: CapabilitiesProviderProps) => {
  const [config, setConfigState] = React.useState<CapabilitiesConfig>(() =>
    loadFromLS(storageKey, defaultCapabilitiesConfig)
  )

  const setConfig = React.useCallback(
    (value: Partial<CapabilitiesConfig> | ((prev: CapabilitiesConfig) => Partial<CapabilitiesConfig>)) => {
      if (typeof value === "function") {
        setConfigState((prevConfig) => {
          const updates = value(prevConfig)
          const newConfig = { ...prevConfig, ...updates }
          saveToLS(storageKey, newConfig)
          return newConfig
        })
      } else {
        setConfigState((prevConfig) => {
          const newConfig = { ...prevConfig, ...value }
          saveToLS(storageKey, newConfig)
          return newConfig
        })
      }
    },
    [storageKey]
  )

  const addCapability = React.useCallback(
    (capability: SelectedCapability) => {
      setConfig((prev) => {
        return {
          selectedCapabilities: [
            ...prev.selectedCapabilities.filter(c => c.id !== capability.id),
            capability
          ],
          lastPinnedToolId: capability.toolId,
          buildStatsCard: {
            ...prev.buildStatsCard,
            currentAppId: capability.toolId // Store the tool ID directly
          }
        }
      })
    },
    [setConfig]
  )

  const removeCapability = React.useCallback(
    (capabilityId: string) => {
      setConfig((prev) => ({
        selectedCapabilities: prev.selectedCapabilities.filter(c => c.id !== capabilityId)
      }))
    },
    [setConfig]
  )

  // localStorage event handling for cross-tab synchronization
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
     if (e.key !== storageKey) {
        return
      }

      // Reload config from localStorage when it changes in another tab
      const newConfig = loadFromLS(storageKey, defaultCapabilitiesConfig)
      setConfigState(newConfig)
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [storageKey])

  // Prevent config access during hydration
  const [isHydrated, setIsHydrated] = React.useState(false)
  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  const providerValue = React.useMemo(
    () => ({
      config: isHydrated ? config : defaultCapabilitiesConfig,
      setConfig,
      addCapability,
      removeCapability,
      isHydrated,
    }),
    [config, setConfig, addCapability, removeCapability, isHydrated]
  )

  return (
    <CapabilitiesContext.Provider value={providerValue}>
      {children}
    </CapabilitiesContext.Provider>
  )
}

const CapabilitiesProvider = (props: CapabilitiesProviderProps) => {
  const context = React.useContext(CapabilitiesContext)

  // Ignore nested context providers, just passthrough children
  if (context) return <>{props.children}</>
  return <CapabilitiesRoot {...props} />
}

// Convenience hooks for common use cases
const useSelectedCapabilities = () => {
  const { config } = useCapabilitiesConfig()
  return config.selectedCapabilities
}

const useCapabilityActions = () => {
  const { addCapability, removeCapability } = useCapabilitiesConfig()
  return { addCapability, removeCapability }
}

const useLastPinnedTool = () => {
  const { config } = useCapabilitiesConfig()
  return config.lastPinnedToolId
}

const useBuildStatsCardState = () => {
  const { config, setConfig } = useCapabilitiesConfig()
  
  const updateBuildStatsCard = React.useCallback(
    (updates: Partial<CapabilitiesConfig['buildStatsCard']>) => {
      setConfig((prev) => ({
        buildStatsCard: { ...prev.buildStatsCard, ...updates }
      }))
    },
    [setConfig]
  )

  return {
    buildStatsCard: config.buildStatsCard,
    updateBuildStatsCard
  }
}

export { 
  useCapabilitiesConfig, 
  CapabilitiesProvider, 
  useSelectedCapabilities,
  useCapabilityActions,
  useLastPinnedTool,
  useBuildStatsCardState,
  type SelectedCapability,
  type CapabilitiesConfig,
}