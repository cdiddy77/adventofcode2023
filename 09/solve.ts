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
  let i = differences.length - 1;
  let last = differences[i];
  last.push(0);
  while (i > 0) {
    differences[i - 1].push(
      differences[i][differences[i].length - 1] +
        differences[i - 1][differences[i - 1].length - 1]
    );
    i--;
  }
}

// const diffs = differences(allHistories[0]);
// extrapolate(diffs);
// console.log(diffs);
const diffs = allHistories.map((h) => differences(h));
diffs.forEach((d) => extrapolate(d));
const result = diffs
  .map((d) => d[0][d[0].length - 1])
  .reduce((a, b) => a + b, 0);

console.log("done", result);
