type UnaryFn<Arg, Return> = (arg: Arg) => Return;

/**
 * A simple memoization function that uses WeakMap to cache results
 * Only works with object arguments (not primitives)
 * Automatically handles garbage collection through WeakMap
 */
export function weakMemoize<Arg extends object, Return>(
  func: UnaryFn<Arg, Return>
): UnaryFn<Arg, Return> {
  const cache = new WeakMap<Arg, Return>();
  
  return (arg: Arg): Return => {
    if (cache.has(arg)) {
      return cache.get(arg)!;
    }
    
    const result = func(arg);
    cache.set(arg, result);
    return result;
  };
} 