import fs from "fs";

const lines: string[] = fs.readFileSync("08/input.txt", "utf8").split("\n");

// console.log(lines);

const directions = lines[0].trim();

interface Node {
  left: string;
  right: string;
}

const map = new Map<string, Node>();

for (let i = 2; i < lines.length; i++) {
  const line = lines[i];
  const regex = /\b[0-9A-Z]+\b/g;
  const arr = line.match(regex);
  // console.log(line, arr);
  const [key, left, right] = arr as string[];
  map.set(key, { left, right });
}
// console.log(map.entries());

const roots: string[] = [];
for (const key of map.keys()) {
  if (key[2] === "A") {
    roots.push(key);
  }
}
console.log(roots);
const foundZ = roots.map((v) => -1);
console.log([...map.keys()].filter((v) => v[2] === "Z"));

const path: string[] = [];
function traverse(): number {
  let count = 0;
  let i = 0;
  while (foundZ.some((v) => v === -1) && count < 1_000_000) {
    // console.log(i, directions[i], directions.length);
    // while (roots.some((v) => v[2] !== "Z") && count < 1_000_000) {
    path.push(roots[1]);
    // console.log(roots, i, count);
    const rootsAtZ = roots
      .map((v, i) => [v, i])
      .filter(([v, i]) => (v as string)[2] === "Z");
    if (rootsAtZ.length > 0) {
      rootsAtZ.forEach(([v, x]) => {
        foundZ[x as number] = count;
      });
      console.log(
        i,
        count,
        "roots at Z",
        // rootsAtZ.length,
        rootsAtZ,
        "roots",
        // roots,
        foundZ
      );
    }

    for (let j = 0; j < roots.length; j++) {
      const key = roots[j];
      const { left, right } = map.get(key) as Node;
      if (directions[i] === "L") {
        roots[j] = left;
      } else {
        roots[j] = right;
      }
    }
    i++;
    count++;
    if (i === directions.length) {
      console.log("resetting i", i, count, directions.length);
      // console.log(roots, i, count);
      i = 0;
    }
  }
  return count;
}

function gcd(a: number, b: number) {
  while (b != 0) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a: number, b: number) {
  return Math.abs(a * b) / gcd(a, b);
}

function lcmArray(arr: number[]) {
  let currentLcm = arr[0];
  for (let i = 1; i < arr.length; i++) {
    currentLcm = lcm(currentLcm, arr[i]);
  }
  return currentLcm;
}

// // Example usage:
// const numbers = [4, 6, 8];
// console.log(lcmArray(numbers)); // This will calculate the LCM of 4, 6, and 8

traverse();
console.log(lcmArray(foundZ));

console.log(traverse());
console.log(path.slice(0, 10));
