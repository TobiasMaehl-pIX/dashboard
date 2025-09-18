import { z } from 'zod';

/**
 * Validation schemas for filter inputs
 */

export const FilterValidationSchema = z.object({
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  tenure: z.number().min(0).max(50).optional(),
  location: z
    .string()
    .max(100)
    .regex(/^[a-zA-Z0-9\s,./-]*$/, 'Location contains invalid characters')
    .optional(),
  employmentType: z
    .enum(['fulltime', 'parttime', 'contractor', 'intern'])
    .optional(),
  workArrangement: z.enum(['hybrid', 'onsite', 'remote']).optional(),
});

export type ValidatedFilters = z.infer<typeof FilterValidationSchema>;

/**
 * Sanitize text input to prevent XSS
 */
export function sanitizeTextInput(input: string): string {
  return input
    .trim()
    .replace(/[<>'"&()]/g, '') // Remove potentially dangerous characters
    .slice(0, 100); // Limit length
}

/**
 * Validate and sanitize filter inputs
 */
export function validateAndSanitizeFilters(
  filters: Record<string, unknown>,
): ValidatedFilters {
  // Sanitize text inputs
  if (filters.location && typeof filters.location === 'string') {
    filters.location = sanitizeTextInput(filters.location);
    if (filters.location === '') {
      filters.location = undefined;
    }
  }

  // Validate using Zod schema
  const result = FilterValidationSchema.safeParse(filters);
  
  if (!result.success) {
    console.warn('Filter validation failed:', result.error);
    // Return a safe default instead of throwing
    return {};
  }

  return result.data;
}