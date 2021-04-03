export function promisePool<F extends (...args: any) => Promise<R>, R>(fns: F[], limit: number): Promise<R[]> {
  return new Promise<R[]>((resolve, reject) => {
    let pending = 0;
    let total = fns.length;
    let i = 0;
    let res = new Array<R>(total);

    const getPromises = () => {
      while (i < total && pending < limit) {
        pending++;
        let j = i++;
        fns[j]().then((r) => {
          res[j] = r;
          pending--;
          getPromises();
        }).catch(e => reject(e));
      }
      if (pending === 0) resolve(res);
    };

    getPromises();
  });
}