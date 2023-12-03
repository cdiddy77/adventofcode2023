// parse input.txt
import fs from "fs";
const lines: string[] = fs.readFileSync("01/input.txt", "utf8").split("\n");
let count = 0;
// for each line
for (let i = 0; i < lines.length; i++) {
  // for each character
  let firstDigit = -1;
  let lastDigit = -1;
  for (let j = 0; j < lines[i].length; j++) {
    const letter = lines[i][j];
    if (isDigit(lines[i][j])) {
      if (firstDigit === -1) {
        firstDigit = parseInt(lines[i][j]);
      }
      lastDigit = parseInt(lines[i][j]);
    }
  }
  count += firstDigit * 10 + lastDigit;
}

console.log(count);

function isDigit(character: string) {
  return /^\d$/.test(character);
}
