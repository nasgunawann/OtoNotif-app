import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function requireAuth(): Promise<{ userId: string }> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user?.id) {
    throw new AuthError()
  }
  return { userId: session.user.id }
}

export class AuthError extends Error {
  constructor() {
    super("Unauthorized")
    this.name = "AuthError"
  }
}

export function requireFields(body: Record<string, unknown>, fields: string[]): string | null {
  for (const f of fields) {
    if (body[f] === undefined || body[f] === null || body[f] === "") {
      return `Field '${f}' is required`
    }
  }
  return null
}

export function unauth() {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
}
