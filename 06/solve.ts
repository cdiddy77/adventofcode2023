import fs from "fs";
import { isDigit, isSymbol } from "../util";

const lines: string[] = fs.readFileSync("06/input2.txt", "utf8").split("\n");

// get the list of times
const times: number[] = lines[0]
  .split(":")[1]
  .split(" ")
  .filter(Boolean)
  .map((txt) => parseInt(txt));
// get the list of distances
const distances: number[] = lines[1]
  .split(":")[1]
  .split(" ")
  .filter(Boolean)
  .map((txt) => parseInt(txt));
console.log("times", times, "distances", distances);

// the formula for calculating distance traveled
function distanceTravelled(time: number, timeButton: number): number {
  return (time - timeButton) * timeButton;
}

// find the range of distances that are better than the record
function compareAscending(a: number, b: number): number {
  return a - b;
}
function compareDescending(a: number, b: number): number {
  return b - a;
}

export const binarySearch = <T, C = T>(
  arr: (i: number) => T,
  c: C,
  compare: (t: T, cmp: C) => number,
  start: number,
  end: number
): number => {
  // Iterate while start not meets end
  while (start <= end) {
    // Find the mid index
    const mid = Math.floor((start + end) / 2);

    // If element is present at mid, return index
    const result = compare(arr(mid), c);
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

const numWinnings: number[] = times.map((t, i) => {
  const time = times[i];
  const distance = distances[i];
  // find the range of distances that are better than the record
  let midWinning = Math.ceil(time / 2);
  if (distanceTravelled(time, midWinning) <= distance) {
    return 0;
  }
  console.log("midWinning", midWinning, distanceTravelled(time, midWinning));
  let lowBound = binarySearch<number>(
    (tb: number) => distanceTravelled(time, tb),
    distance + 1,
    compareAscending,
    0,
    midWinning - 1
  );
  if (lowBound < 0) {
    console.log(
      "lowBound missed",
      lowBound,
      distanceTravelled(time, ~lowBound)
    );
    lowBound = ~lowBound;
  }
  console.log("lowBound", lowBound, distanceTravelled(time, lowBound));
  let highBound = binarySearch<number>(
    (tb: number) => distanceTravelled(time, tb),
    distance,
    compareDescending,
    midWinning,
    time
  );
  if (highBound < 0) {
    console.log(
      "highBound missed",
      highBound,
      distanceTravelled(time, ~highBound)
    );
    highBound = ~highBound;
  }
  console.log("highBound", highBound, distanceTravelled(time, highBound));
  console.log(`result for ${time} = ${highBound - lowBound}`);
  return highBound - lowBound;
});

console.log(
  "result",
  numWinnings,
  numWinnings.reduce((a, b) => a * b, 1)
);
