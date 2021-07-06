import {CacheType, createCache} from "./createCache";
import { isObject } from "./isObject";
import {wrapPromise} from "./wrapPromise";

type PromiseFunc<Result, Input> = (input: Input) => Promise<Result>;
export type PromiseStore<Result, Input> = {
  prefetch: (input: Input) => void;
  evict: (input: Input) => void;
  get: (input: Input) => Result | null;
};

export function createFetchStore<Result, Input>(
  promiseFunc: PromiseFunc<Result, Input>,
  cacheType?: CacheType<Input>,
) {
  type GetResult = () => Result | null;

  const cache = createCache<Input, GetResult>(cacheType);
  const assertObjectInput = (input: Input) => {
    if (cacheType?.type === 'WeakMap' && !isObject(input)) {
      throw new Error('WeakMap requires object input');
    }
  };

  function prefetch(input: Input) {
    assertObjectInput(input);
    if (!cache.has(input)) {
      cache.set(input, wrapPromise<Result>(promiseFunc(input)));
    }
  }

  const store: PromiseStore<Result, Input> = {
    prefetch,
    evict(input: Input) {
      assertObjectInput(input);
      cache.delete(input);
    },
    get: (input: Input) => {
      assertObjectInput(input);
      let getResult = cache.get(input);

      if (!getResult) {
        prefetch(input);
        getResult = cache.get(input) as GetResult;
      }

      return getResult();
    }
  };

  return store;
}