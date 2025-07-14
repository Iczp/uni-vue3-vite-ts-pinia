export function updateSortedList<T>(
  datalist: T[],
  newList: T[],
  compareFn: (a: T, b: T) => number,
): T[] {
  for (const item of newList) {
    let left = 0;
    let right = datalist.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      const compareResult = compareFn(datalist[mid], item);
      if (compareResult < 0) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    datalist.splice(left, 0, item);
  }
  return datalist;
}
