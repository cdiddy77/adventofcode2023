import fs from "fs";
import { isDigit, isEmptyLine, isSymbol } from "../util";

type Ranges = [number, number, number];
type RangesMap = Ranges[];

const lines: string[] = fs.readFileSync("05/input.txt", "utf8").split("\n");
let currentLine = 0;

function destValue(
  [startDest, startSrc, length]: Ranges,
  value: number
): number | undefined {
  return value >= startSrc && value < startSrc + length
    ? startDest + (value - startSrc)
    : undefined;
}

function parseSeeds(): number[] {
  const [seedsTxt, numsTxt] = lines[currentLine++].split(":");
  const values = numsTxt
    .split(" ")
    .filter(Boolean)
    .map((txt) => parseInt(txt));
  console.log("values", values);
  return values;
}

function parseMap(): RangesMap {
  // read first line, should contain map;
  while (isEmptyLine(lines[currentLine])) {
    currentLine++;
  }
  console.log("parseMap- title line", currentLine);
  // expect map:
  const containsMap = lines[currentLine++].includes("map:");
  if (!containsMap) {
    throw new Error("Expected map");
  }
  console.log("parseMap-first range line", currentLine);

  // while not empty line, read lines, parse ranges
  const result: RangesMap = [];
  while (currentLine < lines.length && !isEmptyLine(lines[currentLine])) {
    const line = lines[currentLine++];
    const ranges = line.split(" ").map((txt) => parseInt(txt)) as Ranges;
    result.push(ranges);
  }
  return result;
}
function parseMaps(): RangesMap[] {
  // while not at end of file, parse map, append
  const result: RangesMap[] = [];
  while (currentLine < lines.length) {
    const map = parseMap();
    result.push(map.sort((a, b) => a[1] - b[1]));
  }
  return result;
}

function mapValue(map: RangesMap, value: number): number {
  for (const range of map) {
    const dest = destValue(range, value);
    if (dest !== undefined) {
      return dest;
    } else if (value < range[1]) {
      return value;
    }
  }
  return value;
}

// parse the seeds and all the maps

// for each seed, map it across all the maps
// keep track of the lowest target
const seeds = parseSeeds();
const maps = parseMaps();
// const testSeeds = [14];
let lowest = Number.MAX_VALUE;
for (const seed of seeds) {
  let mappedValue = seed;
  for (const map of maps) {
    const originalValue = mappedValue;
    mappedValue = mapValue(map, mappedValue);
    console.log("in", originalValue, "out", mappedValue, "map", map);
  }
  console.log("seed", seed, "mapped", mappedValue);
  if (mappedValue < lowest) {
    console.log("new lowest", mappedValue);
    lowest = mappedValue;
  }
}

console.log("Done", lowest);
