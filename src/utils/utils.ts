// Helper fn to return true if an object is empty.
export function detectEmptyObject(obj: Object): boolean {
  if (obj // 👈 null and undefined check
    && Object.keys(obj).length === 0
    && Object.getPrototypeOf(obj) === Object.prototype) {
      return true;
  }
  return false;
}

// Given an array of an array of strings, where one column represents numbers
// that you want to get the range on, this function will check that column
// and return an array of the min and max numeric values found (it converts
// the strings to numbers just to check them).
export function getNumericRangeOfArray(arr: any[], indexToCheck: number) {
  let min = Number.MAX_VALUE;
  let max = Number.MIN_VALUE;

  for (let i = 0; i < arr.length; i++) {
    min = Math.min(min, +arr[i][indexToCheck]);
    max = Math.max(max, +arr[i][indexToCheck]);
  }
  return [min, max];
}
