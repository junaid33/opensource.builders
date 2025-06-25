// types/hooks.ts
// This file contains type definitions for hooks and related components

import { FieldMeta, ListMeta } from './admin-meta';

// Re-export types from admin-meta for convenience
export type List = ListMeta;
export type Field = FieldMeta;

// Add any additional hook-specific types here
export interface UseListOptions {
  listKey: string;
  query?: Record<string, any>;
}

export interface UseItemOptions {
  listKey: string;
  itemId: string;
}

export interface UseCreateItemOptions {
  listKey: string;
}

export interface UseUpdateItemOptions {
  listKey: string;
  itemId: string;
}

export interface UseDeleteItemOptions {
  listKey: string;
  itemId: string;
}
