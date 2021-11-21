interface CancelableAsyncIterable<T> extends AsyncIterable<T> {
  cancel(): void;
}

export function cancelableAsyncIterable<T>(iterable: AsyncIterable<T>): CancelableAsyncIterable<T> {
  let cancel = () => {};
  const cancelPromise = new Promise<IteratorResult<T>>((resolve) => {
    cancel = () => {
      resolve({
        value: undefined,
        done: true,
      });
    };
  });

  return {
    cancel,
    async *[Symbol.asyncIterator]() {
      const iterator = iterable[Symbol.asyncIterator]();

      while (true) {
        const result = await Promise.race([
          iterator.next(),
          cancelPromise,
        ]);

        if (result.done) {
          return (await iterator.return?.())?.value;
        }

        yield result.value;
      }
    },
  };
}
