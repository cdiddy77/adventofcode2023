import fs from "fs";
import { isDigit, isSymbol } from "../util";

const lines: string[] = fs.readFileSync("03/input.txt", "utf8").split("\n");

type NumberInfo = {
  startIndex: number;
  endIndex: number;
  value: number;
  key: string;
};

function expandAndParseNumber(
  line: string | undefined,
  lineIndex: number,
  index: number
): NumberInfo | undefined {
  const allDigits = [];
  if (!line) {
    return undefined;
  }
  if (!isDigit(line[index])) {
    return undefined;
  }
  let startIndex = index;
  while (startIndex - 1 >= 0 && isDigit(line[startIndex - 1])) {
    startIndex--;
  }
  let endIndex = index;
  while (endIndex + 1 < line.length && isDigit(line[endIndex + 1])) {
    endIndex++;
  }
  const value = parseInt(line.substring(startIndex, endIndex + 1));
  return { startIndex, endIndex, value, key: `${lineIndex}-${startIndex}` };
}

let total = 0;
const noAdjList: Map<string, NumberInfo> = new Map();
let previousLine: string | undefined;
for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
  const line = lines[lineIndex];
  console.log(`${lineIndex}:${line}`);
  for (let i = 0; i < line.length; i++) {
    // if number,
    if (isDigit(line[i])) {
      const numberInfo = expandAndParseNumber(line, lineIndex, i);
      if (!numberInfo) {
        continue;
      }
      console.log("found number", numberInfo);
      let noAdj = true;
      if (isSymbol(line[i - 1])) {
        console.log("symbol to left");
        noAdj = false;
      } else if (isSymbol(line[numberInfo.endIndex + 1])) {
        console.log("symbol to right");
        noAdj = false;
      }
      // check for symbol above to the left, above, above to the right
      if (previousLine) {
        for (
          let pi = numberInfo.startIndex - 1;
          pi < numberInfo.endIndex + 2;
          pi++
        ) {
          if (isSymbol(previousLine[pi])) {
            console.log("symbol above", pi);
            noAdj = false;
          }
        }
      }
      // if nowhere found, add to no-adjacencies list
      if (noAdj) {
        console.log(`add noadj:${numberInfo.key}`);
        noAdjList.set(numberInfo.key, numberInfo);
      }
      // add to total count
      total += numberInfo.value;
      // move index to end of number
      i = numberInfo.endIndex;
    } else if (isSymbol(line[i])) {
      console.log("found symbol", line[i]);
      // check for number to the left
      let numberInfo = expandAndParseNumber(line, lineIndex, i - 1);
      if (numberInfo) {
        console.log(`remove noadj:${numberInfo.key}`);
        noAdjList.delete(numberInfo.key);
      }
      // check for number to the right
      numberInfo = expandAndParseNumber(line, lineIndex, i + 1);
      if (numberInfo) {
        console.log(`remove noadj:${numberInfo.key}`);
        noAdjList.delete(numberInfo.key);
      }
      // check for number above to the left, above, above to the right
      numberInfo = expandAndParseNumber(previousLine, lineIndex - 1, i - 1);
      if (numberInfo) {
        console.log(`remove noadj:${numberInfo.key}`);
        noAdjList.delete(numberInfo.key);
      }
      numberInfo = expandAndParseNumber(previousLine, lineIndex - 1, i);
      if (numberInfo) {
        console.log(`remove noadj:${numberInfo.key}`);
        noAdjList.delete(numberInfo.key);
      }
      numberInfo = expandAndParseNumber(previousLine, lineIndex - 1, i + 1);
      // if anywhere found, remove from no-adjacencies list
      if (numberInfo) {
        console.log(`remove noadj:${numberInfo.key}`);
        noAdjList.delete(numberInfo.key);
      }
    }
  }
  previousLine = line;
}

// afterward, go through no-adjs list and
// subtract
console.log(`PRE-TOTAL:${total}`);
for (const numberInfo of noAdjList.values()) {
  console.log(`subtract:${numberInfo.key}:${numberInfo.value}`);
  total -= numberInfo.value;
}
console.log(`TOTAL:${total}`);
// keep the previous line and check that one as well.
