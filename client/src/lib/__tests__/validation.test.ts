import { sanitizeTextInput, validateAndSanitizeFilters } from '../validation';

describe('sanitizeTextInput', () => {
  it('should trim whitespace', () => {
    expect(sanitizeTextInput('  test  ')).toBe('test');
  });

  it('should remove dangerous characters', () => {
    expect(sanitizeTextInput('test<script>alert("xss")</script>')).toBe(
      'testscriptalertxss/script',
    );
  });

  it('should limit length to 100 characters', () => {
    const longString = 'a'.repeat(150);
    expect(sanitizeTextInput(longString)).toHaveLength(100);
  });

  it('should handle normal text correctly', () => {
    expect(sanitizeTextInput('New York, NY')).toBe('New York, NY');
  });
});

describe('validateAndSanitizeFilters', () => {
  it('should validate valid filters', () => {
    const filters = {
      tenure: 5,
      location: 'New York',
      employmentType: 'fulltime',
      workArrangement: 'hybrid',
    };

    const result = validateAndSanitizeFilters(filters);
    expect(result).toEqual(filters);
  });

  it('should sanitize location input', () => {
    const filters = {
      location: '  <script>alert("xss")</script>  ',
    };

    const result = validateAndSanitizeFilters(filters);
    expect(result.location).toBe('scriptalertxss/script');
  });

  it('should remove empty location', () => {
    const filters = {
      location: '   ',
    };

    const result = validateAndSanitizeFilters(filters);
    expect(result.location).toBeUndefined();
  });

  it('should handle invalid tenure values', () => {
    const filters = {
      tenure: -5, // Invalid negative value
    };

    const result = validateAndSanitizeFilters(filters);
    expect(result).toEqual({});
  });

  it('should handle invalid employment type', () => {
    const filters = {
      employmentType: 'invalid-type',
    };

    const result = validateAndSanitizeFilters(filters);
    expect(result).toEqual({});
  });

  it('should handle mixed valid and invalid fields', () => {
    const filters = {
      tenure: 10, // Valid
      location: 'New York', // Valid
      employmentType: 'invalid', // Invalid
    };

    const result = validateAndSanitizeFilters(filters);
    expect(result).toEqual({});
  });

  it('should handle empty object', () => {
    const result = validateAndSanitizeFilters({});
    expect(result).toEqual({});
  });
});