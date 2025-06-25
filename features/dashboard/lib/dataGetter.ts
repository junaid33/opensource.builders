import type { GraphQLError } from 'graphql';

// Helper type: Extracts the type of a property if T is an object, otherwise unknown
type PropertyType<T, K> = T extends object ? K extends keyof T ? T[K] : unknown : unknown;

// DataGetter wraps a value of type Data
export type DataGetter<Data> = {
  data: Data | null; // The wrapped data or null
  errors: readonly GraphQLError[] | undefined;

  // 'get' method: Returns a DataGetter for a property's value.
  // K is constrained to keys of Data only if Data is an object.
  // Return type uses PropertyType to get the nested value's type.
  get<K extends (Data extends object ? keyof Data : never)>(fieldName: K): DataGetter<PropertyType<Data, K>>;

  // 'getOrThrow' method: Returns a property's value or throws.
  // K is constrained similarly.
  // Return type uses PropertyType.
  getOrThrow<K extends (Data extends object ? keyof Data : never)>(fieldName: K): PropertyType<Data, K>;
};

// makeDataGetter creates a DataGetter for a value of type Data
export function makeDataGetter<Data>(
  data: Data | null,
  errors: readonly GraphQLError[] | undefined
): DataGetter<Data> {
  const getter: DataGetter<Data> = {
    data,
    errors,
    get<K extends (Data extends object ? keyof Data : never)>(fieldName: K): DataGetter<PropertyType<Data, K>> {
      // Runtime check: Is data a non-null object and does it have the field?
      if (typeof getter.data === 'object' && getter.data !== null && fieldName in getter.data) {
        // Cast needed because TS struggles with the conditional type inference here.
        const val = (getter.data as Record<K, unknown>)[fieldName];
        // Recursively call makeDataGetter with the nested value.
        // Cast the result to the expected return type.
        return makeDataGetter(val, getter.errors) as DataGetter<PropertyType<Data, K>>;
      }
      // If data is null, not an object, or field doesn't exist, return a getter wrapping null.
      // Cast the result to the expected return type.
      // Cast null to the expected nested property type before passing to makeDataGetter
      return makeDataGetter(null as PropertyType<Data, K>, getter.errors);
    },
    getOrThrow<K extends (Data extends object ? keyof Data : never)>(fieldName: K): PropertyType<Data, K> {
      // Runtime check: Is data a non-null object and does it have the field?
      if (typeof getter.data === 'object' && getter.data !== null && fieldName in getter.data) {
        // Cast needed.
        return (getter.data as Record<K, unknown>)[fieldName] as PropertyType<Data, K>;
      }
      // If data is null, not an object, or field doesn't exist, throw error.
      throw new Error(
        `Expected data object with property: ${String(fieldName)}`
      );
    },
  };

  return getter;
}