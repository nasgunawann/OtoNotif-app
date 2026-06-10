export function requireFields(body: Record<string, unknown>, fields: string[]): string | null {
  for (const f of fields) {
    if (body[f] === undefined || body[f] === null || body[f] === "") {
      return `Field '${f}' is required`
    }
  }
  return null
}
