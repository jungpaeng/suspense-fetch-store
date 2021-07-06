import React from 'react';
import { wrapPromise } from '../lib/wrapPromise';

function fakeAPI() {
  return new Promise(resolve => setTimeout(() => {
    resolve("SUCCESS");
  }, 1000));
}
function callFakeAPI() {
  const apiResult = fakeAPI()
  return wrapPromise(apiResult);
}

const initValue = callFakeAPI();

function App() {
  return (
    <React.Suspense fallback={<p>Loading...</p>}>
      <Child value={initValue}/>
    </React.Suspense>
  );
}

export default App;

function Child({value}: any) {
  return <p>{value.read()}</p>
}