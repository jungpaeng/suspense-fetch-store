import React from 'react';

function wrapPromise(promise: Promise<any>) {
  let status = "pending";
  let result: any;

  const suspender = promise.then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      result = e;
    }
  )

  return {
    read() {
      if (status === "pending")
        throw suspender;
      if (status === "error")
        throw result;

      return result;
    }
  }
}

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