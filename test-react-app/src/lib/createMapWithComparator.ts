export function createMapLikeWithComparator<Key, Value>(areEqual: (a: Key, b: Key) => boolean) {
  const map = new Map<Key, Value>();

  return {
    set(key: Key, value: Value) {
      map.set(key, value);
    },
    has(key: Key) {
      for (const [k] of map) {
        if (areEqual(k, key)) return true;
      }
      return false;
    },
    get(key: Key) {
      for (const [k, v] of map) {
        if (areEqual(k, key)) return v;
      }
      return undefined;
    },
    delete(key: Key) {
      for (const [k] of map) {
        if (areEqual(k, key)) map.delete(k);
      }
    },
  };
}