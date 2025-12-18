/**
 * Generates a URL-friendly slug from a string
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Remove accents/diacritics
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove all non-word characters except hyphens
    .replace(/[^\w\-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Generates a unique slug by appending a random suffix if needed
 * @param text - The text to convert to a slug
 * @param existingSlugs - Array of existing slugs to check against (optional)
 * @returns A unique URL-friendly slug
 */
export function generateUniqueSlug(text: string, existingSlugs?: string[]): string {
  const baseSlug = generateSlug(text)
  
  if (!existingSlugs || !existingSlugs.includes(baseSlug)) {
    return baseSlug
  }
  
  // If slug exists, append a random suffix
  const suffix = Math.random().toString(36).substring(2, 8)
  return `${baseSlug}-${suffix}`
}

/**
 * Validates if a string is a valid slug format
 * @param slug - The slug to validate
 * @returns Boolean indicating if the slug is valid
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugRegex.test(slug)
}

