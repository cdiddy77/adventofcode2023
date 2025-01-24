import fs from "fs";

const lines: string[] = fs.readFileSync("12/input.txt", "utf8").split("\n");

interface SpringRow {
  springs: string;
  constraints: number[];
}
const verbose = false;
function conlog(message?: any, ...optionalParams: any[]): void {
  if (verbose) {
    console.log(message, ...optionalParams);
  }
}

function parseRow(row: string): SpringRow {
  const [springs, constraintsTxt] = row.split(" ");
  const replicatedSprings = Array.from([0, 1, 2, 3, 4])
    .map((_) => springs)
    .join("?");
  const replicatedConstraintsText = Array.from([0, 1, 2, 3, 4])
    .map((_) => constraintsTxt)
    .join(",");
  const constraints = replicatedConstraintsText
    .split(",")
    .map((c) => parseInt(c));
  return { springs: replicatedSprings, constraints };
}

function replaceAt(str: string, index: number, replacement: string) {
  return (
    str.slice(0, index) + replacement + str.slice(index + replacement.length)
  );
}

function knownContiguousRegions(str: string): number[] {
  const result: number[] = [];
  let j = -1;
  let i = 0;
  for (; i < str.length && str[i] !== "?"; i++) {
    if (str[i] !== "#") {
      if (j != -1) {
        // console.log("pushing", i, j, i - j);
        result.push(i - j);
        j = -1;
      }
    } else if (str[i] === "#") {
      if (j == -1) {
        j = i;
      }
    }
  }
  if (j != -1) {
    // if the last thing we saw is a question, then
    // don't really know how long the last contiguous region is
    if (str[i] !== "?") {
      //   console.log("final pushing", i, j, i - j);
      result.push(i - j);
    } else {
      result.push(-(i - j));
    }
  }
  return result;
}

function compareContiguousRegions(
  known: number[],
  constraint: number[]
): boolean | undefined {
  let i = 0;
  if (known.length > constraint.length) {
    return false;
  }
  for (; i < known.length; i++) {
    if (known[i] < 0) {
      const sofar = -known[i];
      if (sofar > constraint[i]) {
        return false;
      }
    } else {
      if (known[i] !== constraint[i]) {
        return false;
      }
    }
  }
  if (i < constraint.length) {
    return undefined;
  }
  return true;
}

function key(knownContig: number[], springslen: number): string {
  return knownContig.join(",") + "|" + springslen;
}

const memo = new Map<string, number>();

function findPossiblePerms(
  springs: string,
  constraints: number[],
  resultSet: Set<string>
): number {
  conlog("===findPossiblePerms", springs, constraints);
  const known = knownContiguousRegions(springs);
  const firstUnknownIndex = springs.indexOf("?");
  const memoKey = key(known, firstUnknownIndex);
  conlog("testing  ", key(known, firstUnknownIndex));
  const memoized = memo.get(memoKey);
  if (
    memoized !== undefined &&
    known.length > 0 &&
    known[known.length - 1] > 0 &&
    firstUnknownIndex >= 0
  ) {
    conlog("return memoized ", memoKey, memoized, springs);
    return memoized;
  }
  if (firstUnknownIndex === -1) {
    if (compareContiguousRegions(known, constraints) === true) {
      conlog("found solution", springs);
      if (resultSet.has(springs)) {
        conlog("already found", springs);
      }
      resultSet.add(springs);
    }
    return 1;
  }
  const asDot = replaceAt(springs, firstUnknownIndex, ".");
  const asBroken = replaceAt(springs, firstUnknownIndex, "#");
  const knownDot = knownContiguousRegions(asDot);
  const knownBroken = knownContiguousRegions(asBroken);
  const compareDot = compareContiguousRegions(knownDot, constraints);
  const compareBroken = compareContiguousRegions(knownBroken, constraints);
  //   conlog("asDot:", asDot, knownDot, constraints, compareDot);
  //   conlog("asBroken:", asBroken, knownBroken, constraints, compareBroken);
  let count = 0;
  if (compareDot !== false) {
    // conlog("recursing d", asDot, knownDot.length);
    const dotResult = findPossiblePerms(asDot, constraints, resultSet);
    conlog("dotResult", dotResult, asDot, knownDot.length);
    count += dotResult;
  }
  if (compareBroken !== false) {
    // conlog("recursing b", asBroken, knownBroken.length);
    const brokenResult = findPossiblePerms(asBroken, constraints, resultSet);
    conlog("brokenResult", brokenResult, asBroken, knownBroken.length);
    count += brokenResult;
  }
  if (
    // count > 0 &&
    known.length > 0 &&
    known[known.length - 1] > 0 &&
    firstUnknownIndex >= 0
  ) {
    if (memoized !== undefined && memoized !== count) {
      conlog("MEMOIZING DISAGREE ", { memoKey, memoized, count });
    } else {
      conlog("memoizing", memoKey, count);
    }
    memo.set(memoKey, count);
  }
  return count;
}

function findAllPossiblePerms(springs: string, constraints: number[]) {
  memo.clear();
  const resultSet = new Set<string>();
  const count = findPossiblePerms(springs, constraints, resultSet);
  return { count, resultSet };
}

// let total = 0;
// for (let i = 0; i < lines.length; i++) {
//   const row = parseRow(lines[i]);
//   const perms = findAllPossiblePerms(row.springs, row.constraints);
//   console.log(row, perms.count);
//   total += perms.count;
// }
// console.log(total);

// const row = parseRow(".??..??...?##. 1,1,3");
const row = parseRow("?###???????? 3,2,1");
// const row = parseRow("?###???????? 3,2,1");
console.log(row);
const perms = findAllPossiblePerms(row.springs, row.constraints);
console.log(row, perms.count, perms.resultSet.size);
