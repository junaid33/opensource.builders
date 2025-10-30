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
      canManageApplications: boolean
      canManageCategories: boolean
      canManageCapabilities: boolean
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
  canManageApplications: ({ session }: AccessArgs) => session?.data.role?.canManageApplications ?? false,
  canManageCategories: ({ session }: AccessArgs) => session?.data.role?.canManageCategories ?? false,
  canManageCapabilities: ({ session }: AccessArgs) => session?.data.role?.canManageCapabilities ?? false,
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