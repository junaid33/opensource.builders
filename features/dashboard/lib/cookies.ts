"use server"
import { cookies } from "next/headers"

export const getAuthHeaders = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get("keystonejs-session")?.value

  if (token) {
    return { authorization: `Bearer ${token}` }
  }

  return {}
}

export const removeAuthToken = async () => {
  (await cookies()).set("keystonejs-session", "", {
    maxAge: -1,
  })
}
