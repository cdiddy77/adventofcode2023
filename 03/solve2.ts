import fs from "fs";
import { isDigit, isGearSymbol, isSymbol } from "../util";

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
for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
  const prevLine = lines[lineIndex - 1];
  const line = lines[lineIndex];
  const nextLine = lines[lineIndex + 1];
  console.log(`${lineIndex}:${line}`);
  for (let i = 0; i < line.length; i++) {
    // if number,
    if (isGearSymbol(line[i])) {
      console.log("found gear symbol", line[i]);
      // check for number to the left
      const numberInfos = new Map<string, NumberInfo>();
      let numberInfo = expandAndParseNumber(line, lineIndex, i - 1);
      for (let row = lineIndex - 1; row <= lineIndex + 1; row++) {
        for (let col = i - 1; col <= i + 1; col++) {
          numberInfo = expandAndParseNumber(lines[row], row, col);
          if (numberInfo) {
            console.log(`(${row},${col})${numberInfo.key}`);
            numberInfos.set(numberInfo.key, numberInfo);
          }
        }
      }
      console.log("found", [...numberInfos.values()]);
      if (numberInfos.size === 2) {
        const gearRatio = [...numberInfos.values()].reduce(
          (acc, curr) => acc * curr.value,
          1
        );
        console.log(`gear ratio:${gearRatio}`);
        total += gearRatio;
      }
    }
  }
}

// afterward, go through no-adjs list and
// subtract
console.log(`TOTAL:${total}`);
// keep the previous line and check that one as well.
