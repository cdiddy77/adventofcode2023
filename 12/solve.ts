import fs from "fs";

const lines: string[] = fs.readFileSync("12/testin.txt", "utf8").split("\n");

interface SpringRow {
  springs: string;
  constraints: number[];
}

function parseRow(row: string): SpringRow {
  const [springs, constraintsTxt] = row.split(" ");
  const constraints = constraintsTxt.split(",").map((c) => parseInt(c));
  return { springs, constraints };
}

let total = 0;
for (let i = 0; i < lines.length; i++) {
  const row = parseRow(lines[i]);
  const perms = findAllPossiblePerms(row.springs, row.constraints);
  console.log(row, perms.size);
  total += perms.size;
}
console.log(total);

// const row = parseRow("?###???????? 3,2,1");
// const perms = findAllPossiblePerms(row.springs, row.constraints);
// console.log(row, perms.size);

// function arrangements(
//     springs:string,
//      springsStartIndex:number,
//      constraints:number[],
//      constraintStartIndex:number):number{
// }

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

function findPossiblePerms(
  springs: string,
  constraints: number[],
  resultSet: Set<string>
) {
  //   console.log("===findPossiblePerms", springs, constraints);
  const firstUnknownIndex = springs.indexOf("?");
  if (firstUnknownIndex === -1) {
    const known = knownContiguousRegions(springs);
    if (compareContiguousRegions(known, constraints) === true) {
      //   console.log("found solution", springs);
      resultSet.add(springs);
    }
    return;
  }
  const asDot = replaceAt(springs, firstUnknownIndex, ".");
  const asBroken = replaceAt(springs, firstUnknownIndex, "#");
  const knownDot = knownContiguousRegions(asDot);
  const knownBroken = knownContiguousRegions(asBroken);
  const compareDot = compareContiguousRegions(knownDot, constraints);
  const compareBroken = compareContiguousRegions(knownBroken, constraints);
  //   console.log("asDot:", asDot, knownDot, constraints, compareDot);
  //   console.log("asBroken:", asBroken, knownBroken, constraints, compareBroken);
  if (compareDot !== false) {
    findPossiblePerms(asDot, constraints, resultSet);
  }
  if (compareBroken !== false) {
    findPossiblePerms(asBroken, constraints, resultSet);
  }
}

function findAllPossiblePerms(
  springs: string,
  constraints: number[]
): Set<string> {
  const resultSet = new Set<string>();
  findPossiblePerms(springs, constraints, resultSet);
  return resultSet;
}

// console.log(findAllPossiblePerms(".??..??...?##.", [1, 1, 3]));
// function generatePermutations(springs: string): string[] {
//   const result: string[] = [springs];
//   for (let i = 0; i < springs.length; i++) {
//     if (springs[i] === "?") {
//       result.push(...generatePermutations(replaceAt(springs, i, "#")));
//       result.push(...generatePermutations(replaceAt(springs, i, ".")));
//       return result;
//     }
//   }
//   result.push(springs);
//   return result;
// }

// const perms = generatePermutations(".??..??...?##.");
// console.log(
//   perms,
//   perms.length,
//   perms.filter((p) =>
//     compareContiguousRegions(knownContiguousRegions(p), [1, 1, 3])
//   )
// );
