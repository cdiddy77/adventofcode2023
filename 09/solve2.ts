import fs from "fs";

const lines: string[] = fs.readFileSync("09/input.txt", "utf8").split("\n");
const allHistories = lines.map((l) => l.split(" ").map((v) => parseInt(v)));

function step(nums: number[]): number[] {
  const result: number[] = [];
  for (let i = 1; i < nums.length; i++) {
    result.push(nums[i] - nums[i - 1]);
  }
  return result;
}

function differences(history: number[]): number[][] {
  const result: number[][] = [];
  let cur = history;
  result.push(cur);
  while (cur.some((v) => v !== 0)) {
    cur = step(cur);
    result.push(cur);
  }
  return result;
}

function extrapolate(differences: number[][]) {
  let i = differences.length - 2;
  let cur = 0;
  while (i >= 0) {
    // console.log(i, cur, differences[i]);
    cur = differences[i][differences[i].length - 1] + cur;
    i--;
  }
  // console.log("return", cur);
  return cur;
}

function extrapolateBack(differences: number[][]) {
  let i = differences.length - 2;
  let cur = 0;
  while (i >= 0) {
    // console.log(i, cur, differences[i]);
    cur = differences[i][0] - cur;
    i--;
  }
  // console.log("return", cur);
  return cur;
}

// const diffs = differences(allHistories[0]);
// extrapolate(diffs);
// console.log(diffs);
const diffs = allHistories.map((h) => differences(h));
const extrapolations = diffs.map((d) => extrapolateBack(d));
// diffs.forEach((d) => extrapolate(d));
// const result = diffs
//   .map((d) => d[0][d[0].length - 1])
//   .reduce((a, b) => a + b, 0);
const result = extrapolations.reduce((a, b) => a + b, 0);

console.log("done", extrapolations, result);
