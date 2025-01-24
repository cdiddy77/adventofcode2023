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
  const regex = /\b[A-Z]+\b/g;
  const arr = line.match(regex);
  const [key, left, right] = arr as string[];
  map.set(key, { left, right });
}
// console.log(map.entries());

const path: string[] = [];

function traverse(): number {
  let count = 0;
  let i = 0;
  let key = "AAA";
  while (key !== "ZZZ") {
    path.push(key);
    const { left, right } = map.get(key) as Node;
    if (directions[i] === "L") {
      key = left;
    } else {
      key = right;
    }
    i++;
    count++;
    if (i === directions.length) {
      i = 0;
    }
  }
  return count;
}

console.log(traverse());
console.log(path.slice(0, 10));
