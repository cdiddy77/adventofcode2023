import fs from "fs";
import { isDigit, isEmptyLine, isSymbol } from "../util";

type Range = [number, number];
const R_START = 0;
const R_LEN = 1;
type RangeMap = [number, number, number];
const M_DEST = 0;
const M_SRC = 1;
const M_LEN = 2;
type RangeMaps = RangeMap[];

const startTime = Date.now();
const lines: string[] = fs.readFileSync("05/input.txt", "utf8").split("\n");
const afterReadTime = Date.now();
let currentLine = 0;

function destValue(
  [startDest, startSrc, length]: RangeMap,
  value: number
): number | undefined {
  return value >= startSrc && value < startSrc + length
    ? startDest + (value - startSrc)
    : undefined;
}

function parseSeedPairs(): Range[] {
  const [seedsTxt, numsTxt] = lines[currentLine++].split(":");
  const values = numsTxt
    .split(" ")
    .filter(Boolean)
    .map((txt) => parseInt(txt));
  // console.log("values", values);
  const result: Range[] = [];
  for (let i = 0; i < values.length; i += 2) {
    result.push([values[i], values[i + 1]]);
  }
  return result;
}

function parseMap(): RangeMaps {
  // read first line, should contain map;
  while (isEmptyLine(lines[currentLine])) {
    currentLine++;
  }
  // console.log("parseMap- title line", currentLine);
  // expect map:
  const containsMap = lines[currentLine++].includes("map:");
  if (!containsMap) {
    throw new Error("Expected map");
  }
  // console.log("parseMap-first range line", currentLine);

  // while not empty line, read lines, parse ranges
  const result: RangeMaps = [];
  while (currentLine < lines.length && !isEmptyLine(lines[currentLine])) {
    const line = lines[currentLine++];
    const ranges = line.split(" ").map((txt) => parseInt(txt)) as RangeMap;
    result.push(ranges);
  }
  return result;
}
function parseMaps(): RangeMaps[] {
  // while not at end of file, parse map, append
  const result: RangeMaps[] = [];
  while (currentLine < lines.length) {
    const map = parseMap();
    result.push(map.sort((a, b) => a[1] - b[1]));
  }
  return result;
}

function mapValue(map: RangeMaps, value: number): number {
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

function mapRange(map: RangeMaps, [instart, inlen]: Range): Range[] {
  let currstart = instart;
  let curlen = inlen;
  let mapIndex = 0;
  const result: Range[] = [];
  // find the index of the first map that starts on or after instart
  while (mapIndex < map.length && curlen > 0) {
    while (
      mapIndex < map.length &&
      currstart >= map[mapIndex][M_SRC] + map[mapIndex][M_LEN]
    ) {
      mapIndex++;
    }
    if (mapIndex === map.length) {
      break;
    }
    const currRange = map[mapIndex];
    const gaplen = Math.min(currRange[M_SRC] - currstart, curlen);
    if (gaplen > 0) {
      // account for a gap, so just map 1:1
      result.push([currstart, gaplen]);
      currstart += gaplen;
      curlen -= gaplen;
    }
    // the next range is the intersection
    const intersectOffset = Math.max(0, currstart - currRange[M_SRC]);
    const intersectLen = Math.min(curlen, currRange[M_LEN] - intersectOffset);
    if (intersectLen > 0) {
      result.push([currRange[M_DEST] + intersectOffset, intersectLen]);
    }

    currstart = currRange[M_SRC] + currRange[M_LEN];
    curlen -= intersectLen;
  }

  if (mapIndex === map.length && curlen > 0) {
    // no maps start on or after currstart, so we're done
    result.push([currstart, curlen]);
  }
  // console.log("mapRange", [instart, inlen], "to", result);
  return result;
}

function mapRanges(map: RangeMaps, ranges: Range[]): Range[] {
  const result: Range[] = [];
  for (const range of ranges) {
    result.push(...mapRange(map, range));
  }
  return result;
}

// parse the seeds and all the maps

// for each seed, map it across all the maps
// keep track of the lowest target
const seedPairs = parseSeedPairs();
const maps = parseMaps();
// const testSeeds = [14];
let lowest = Number.MAX_VALUE;
for (const range of seedPairs) {
  // console.log("seedpair", range);
  let input = [range];
  for (const map of maps) {
    const output = mapRanges(map, input);
    // console.log(
    //   "mapped",
    //   input.length,
    //   "ranges to",
    //   output.length,
    //   " ranges with map",
    //   map
    // );
    input = output;
  }

  for (const range of input) {
    if (range[R_START] < lowest) {
      lowest = range[R_START];
    }
  }
  // console.log("scanning range from", start, "to", start + len);
  // for (let seed = start; seed < start + len; seed++) {
  //   let mappedValue = seed;
  //   for (const map of maps) {
  //     const originalValue = mappedValue;
  //     mappedValue = mapValue(map, mappedValue);
  //     // console.log("in", originalValue, "out", mappedValue, "map", map);
  //   }
  //   // console.log("seed", seed, "mapped", mappedValue);
  //   if (mappedValue < lowest) {
  //     // console.log("new lowest", mappedValue);
  //     lowest = mappedValue;
  //   }
  // }
}

// console.log(
//   seedPairs.length,
//   seedPairs.reduce((acc, [start, len]) => acc + len, 0)
// );

const endTime = Date.now();
console.log("Done", lowest);
console.log("Read time", afterReadTime - startTime);
console.log("Solve time", endTime - afterReadTime);
console.log("Total time", endTime - startTime);
