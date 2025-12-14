import { describe, it, expect } from 'vitest';
import { getSortFromSearchParams } from './sort';

// Mock Type Definition for better type safety
type MockList = {
  fields: Record<string, { isOrderable: boolean }>;
  initialSort?: { field: string; direction: string };
};

describe('getSortFromSearchParams', () => {
  const baseList: MockList = {
    fields: {
      name: { isOrderable: true },
      age: { isOrderable: true },
      email: { isOrderable: false },
      createdAt: { isOrderable: true },
    },
    initialSort: { field: 'age', direction: 'desc' },
  };

  describe('Query Params (Priority 1)', () => {
    it('should use "sortBy" param when field is orderable', () => {
      const result = getSortFromSearchParams(baseList, { sortBy: 'name' });
      expect(result).toEqual({ field: 'name', direction: 'asc' });
    });

    it('should handle descending sort with "-" prefix', () => {
      const result = getSortFromSearchParams(baseList, { sortBy: '-name' });
      expect(result).toEqual({ field: 'name', direction: 'desc' });
    });

    it('should ignore non-orderable fields in sortBy and fallback', () => {
      // "email" is not orderable, so it should fall back to initialSort
      const result = getSortFromSearchParams(baseList, { sortBy: 'email' });
      expect(result).toEqual({ field: 'age', direction: 'desc' });
    });
  });

  describe('Initial Sort (Priority 2)', () => {
    it('should use "initialSort" if no valid query param is provided', () => {
      const result = getSortFromSearchParams(baseList, {});
      expect(result).toEqual({ field: 'age', direction: 'desc' });
    });

    it('should skip "initialSort" if the field is no longer orderable', () => {
      const listWithBadInitial = {
        ...baseList,
        initialSort: { field: 'email', direction: 'asc' } // email is not orderable
      };
      const result = getSortFromSearchParams(listWithBadInitial, {});
      
      // Falls back to "preferred fields" (createdAt)
      expect(result).toEqual({ field: 'createdAt', direction: 'desc' });
    });
  });

  describe('Preferred Fields (Priority 3)', () => {
    // Preferred fields: ['createdAt', 'updatedAt', 'timestamp', 'date', 'id']
    
    it('should fallback to "createdAt" (desc) if nothing else matches', () => {
      const minimalList = {
        fields: {
          createdAt: { isOrderable: true },
          other: { isOrderable: true }
        }
      };
      const result = getSortFromSearchParams(minimalList, {});
      expect(result).toEqual({ field: 'createdAt', direction: 'desc' });
    });

    it('should use "id" (asc) if it is the only preferred field available', () => {
      // This covers the logic: direction: fieldName === 'id' ? 'asc' : 'desc'
      const idOnlyList = {
        fields: {
          id: { isOrderable: true }, // id is preferred
          other: { isOrderable: true }
        }
      };
      const result = getSortFromSearchParams(idOnlyList, {});
      expect(result).toEqual({ field: 'id', direction: 'asc' });
    });
  });

  describe('Any Orderable Field & Final Fallback (Priority 4 & 5)', () => {
    it('should pick the first available orderable field if no preferred fields exist', () => {
      const bareList = {
        fields: {
          customField: { isOrderable: true }
        }
      };
      
      const result = getSortFromSearchParams(bareList, {});
      expect(result).toEqual({ field: 'customField', direction: 'asc' });
    });

    it('should return default "id" fallback if absolutely no orderable fields found', () => {
      const emptyList = { fields: {} };
      const result = getSortFromSearchParams(emptyList, {});
      expect(result).toEqual({ field: 'id', direction: 'asc' });
    });
  });
});
