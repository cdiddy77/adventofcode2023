export function isDigit(character: string | undefined) {
  return character ? /^\d$/.test(character) : false;
}

export function isSymbol(character: string | undefined) {
  return character !== undefined && character !== "." && !isDigit(character);
}

export function isGearSymbol(character: string | undefined) {
  return character !== undefined && character === "*";
}

export function isDef<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function isEmptyLine(line: string) {
  return line.trim() === "";
}

export const binarySearch = <T, C = T>(
  arr: T[],
  c: C,
  compare: (t: T, cmp: C) => number
): number => {
  let start = 0,
    end = arr.length - 1;

  // Iterate while start not meets end
  while (start <= end) {
    // Find the mid index
    const mid = Math.floor((start + end) / 2);

    // If element is present at mid, return index
    const result = compare(arr[mid], c);
    if (result === 0) {
      return mid;
    }
    // Else look in left or right half accordingly
    else if (result < 0) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  // if we didn't find it, return the ~ index where it should
  // be inserted.
  return ~start;
};
