export function wrapPromise<Result extends unknown>(promiseFunc: Promise<any>) {
  let status: "pending" | "success" | "error" = "pending";
  let result: Result | null = null;
  let error: Error | null = null;

  const suspender = promiseFunc.then(
    r => {
      status = "success";
      result = r;
    },
    e => {
      status = "error";
      error = e;
    }
  );

  return {
    read() {
      switch (status) {
        case "pending": throw suspender;
        case "error": throw error;
        case "success": return result;
        default: throw suspender;
      }
    }
  }
}
