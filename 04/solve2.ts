import fs from "fs";
import { isDigit, isSymbol } from "../util";

const lines: string[] = fs
  .readFileSync("04/input.txt", "utf8")
  .split("\n")
  .filter(Boolean);
const cards = new Array(lines.length).fill(1);
let total = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  //   console.log(line);
  if (line.length === 0) {
    continue;
  }
  const [cardnum, numlists] = line.split(":");
  const [winningTxt, haveTxt] = numlists.split("|");
  //   console.log(
  //     `[${winningTxt.split(" ").filter(Boolean)}], [${haveTxt
  //       .split(" ")
  //       .filter(Boolean)}]`
  //   );
  const winningNumsSet = new Set(
    winningTxt
      .split(" ")
      .filter(Boolean)
      .map((v) => parseInt(v))
  );
  const haveNums = haveTxt
    .split(" ")
    .filter(Boolean)
    .map((v) => parseInt(v));
  //   const haveNumsSet = new Set(haveNums);
  //   console.log(winningNums, haveNums);
  const intersect = haveNums.filter((v) => winningNumsSet.has(v));
  // const cardTotal = intersect.length // ? Math.pow(2, intersect.length - 1) : 0;
  for (let j = 0; j < intersect.length; j++) {
    cards[i + j + 1] += cards[i];
  }
  console.log("current", i, intersect.length);
  // console.log(`${cardnum}: ${intersect.length} ${cardTotal}`);
  // total += cardTotal;
}
console.log(cards.slice(-1));
total = cards.reduce((acc, v) => acc + v, 0);
console.log(`Total: ${total}`);
