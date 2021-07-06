import React from 'react';
import {createFetchStore} from "../lib/createFetchStore";

const fetchFunc = async (userId: string) => (await fetch(`https://reqres.in/api/users/${userId}?delay=3`)).json();
const store = createFetchStore(fetchFunc);
store.prefetch('1');

function App() {
  return (
    <React.Suspense fallback={<p>Loading...</p>}>
      <Child store={store}/>
    </React.Suspense>
  );
}

export default App;

function Child({store}: any) {
  const [state, setState] = React.useState(1);

  React.useEffect(() => {
    store.prefetch(state.toString());
  }, [store, state])

  return (
    <div>
      <p>id: {store.get(state.toString()).data.id}</p>
      <button onClick={() => store.prefetch(state.toString())}>
        Reload
      </button>
      <button onClick={() => store.evict(state.toString())}>
        Evict
      </button>
      <button onClick={() => setState(curr => curr + 1)}>
        Next
      </button>
    </div>
  )
}