import {createMapLikeWithComparator} from "./createMapWithComparator";

export type CacheType<Input> =
  { type: 'WeakMap'} |
  { type: 'Map'; isEqual?: ((a: Input, b: Input) => boolean); }

export function createCache<Input, GetResult>(
  cacheType?: CacheType<Input>,
) {
  if (cacheType?.type === 'WeakMap') {
    return new WeakMap<object, GetResult>() as unknown as Map<Input, GetResult>;
  }

  const isEqual = cacheType?.type === 'Map' && cacheType.isEqual;
  if (isEqual) {
    return createMapLikeWithComparator<Input, GetResult>(isEqual);
  }

  return new Map<Input, GetResult>();
}