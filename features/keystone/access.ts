export type Session = {
  itemId: string
  listKey: string
  data: {
    name: string
    role: {
      id: string
      name: string
      canCreateTodos: boolean
      canManageAllTodos: boolean
      canSeeOtherPeople: boolean
      canEditOtherPeople: boolean
      canManagePeople: boolean
      canManageRoles: boolean
      canAccessDashboard: boolean
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
  canCreateTodos: ({ session }: AccessArgs) => session?.data.role?.canCreateTodos ?? false,
  canManageAllTodos: ({ session }: AccessArgs) => session?.data.role?.canManageAllTodos ?? false,
  canManagePeople: ({ session }: AccessArgs) => session?.data.role?.canManagePeople ?? false,
  canManageRoles: ({ session }: AccessArgs) => session?.data.role?.canManageRoles ?? false,
}

export const rules = {
  canReadTodos: ({ session }: AccessArgs) => {
    if (!session) return false

    if (session.data.role?.canManageAllTodos) {
      return {
        OR: [
          { assignedTo: { id: { equals: session.itemId } } },
          { assignedTo: null, isPrivate: { equals: true } },
          { NOT: { isPrivate: { equals: true } } },
        ],
      }
    }

    return { assignedTo: { id: { equals: session.itemId } } }
  },
  canManageTodos: ({ session }: AccessArgs) => {
    if (!session) return false

    if (session.data.role?.canManageAllTodos) return true

    return { assignedTo: { id: { equals: session.itemId } } }
  },
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