export type Session = {
  itemId: string
  listKey: string
  data: {
    name: string
    role: {
      id: string
      name: string
      canSeeOtherPeople: boolean
      canEditOtherPeople: boolean
      canManagePeople: boolean
      canManageRoles: boolean
      canAccessDashboard: boolean
      canManageTools: boolean
      canManageCategories: boolean
      canManageFeatures: boolean
      canManageAlternatives: boolean
      canManageDeploymentOptions: boolean
      canManageTechStacks: boolean
    }
  }
}

type AccessArgs = {
  session?: Session
}

export function isSignedIn({ session }: AccessArgs) {
  return Boolean(session)
}

export const permissions = {
  canManagePeople: ({ session }: AccessArgs) => session?.data.role?.canManagePeople ?? false,
  canManageRoles: ({ session }: AccessArgs) => session?.data.role?.canManageRoles ?? false,
  canManageTools: ({ session }: AccessArgs) => session?.data.role?.canManageTools ?? false,
  canManageCategories: ({ session }: AccessArgs) => session?.data.role?.canManageCategories ?? false,
  canManageFeatures: ({ session }: AccessArgs) => session?.data.role?.canManageFeatures ?? false,
  canManageAlternatives: ({ session }: AccessArgs) => session?.data.role?.canManageAlternatives ?? false,
  canManageDeploymentOptions: ({ session }: AccessArgs) => session?.data.role?.canManageDeploymentOptions ?? false,
  canManageTechStacks: ({ session }: AccessArgs) => session?.data.role?.canManageTechStacks ?? false,
}

export const rules = {
  canReadPeople: ({ session }: AccessArgs) => {
    if (!session) return false

    if (session.data.role?.canSeeOtherPeople) return true

    return { id: { equals: session.itemId } }
  },
  canUpdatePeople: ({ session }: AccessArgs) => {
    if (!session) return false

    if (session.data.role?.canEditOtherPeople) return true

    return { id: { equals: session.itemId } }
  },
}