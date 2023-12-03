// parse input.txt
import fs from "fs";
import readline from "readline";

function pauseAndWaitForInput(query: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Example usage
// (async () => {
//   const input = await pauseAndWaitForInput("Enter something: ");
//   console.log(`You entered: ${input}`);
// })();

(async () => {
  const lines: string[] = fs.readFileSync("01/input.txt", "utf8").split("\n");
  let count = 0;

  interface DigitInfo {
    text: string;
    value: number;
  }

  const digitInfos: DigitInfo[] = [
    // { text: "zero", value: 0 },
    { text: "one", value: 1 },
    { text: "two", value: 2 },
    { text: "three", value: 3 },
    { text: "four", value: 4 },
    { text: "five", value: 5 },
    { text: "six", value: 6 },
    { text: "seven", value: 7 },
    { text: "eight", value: 8 },
    { text: "nine", value: 9 },
    // { text: "0", value: 0 },
    { text: "1", value: 1 },
    { text: "2", value: 2 },
    { text: "3", value: 3 },
    { text: "4", value: 4 },
    { text: "5", value: 5 },
    { text: "6", value: 6 },
    { text: "7", value: 7 },
    { text: "8", value: 8 },
    { text: "9", value: 9 },
  ];

  function compareText(line: string, index: number, digitInfo: DigitInfo) {
    const text = line.substring(index, index + digitInfo.text.length);
    return text === digitInfo.text ? digitInfo.value : -1;
  }

  function getMatchingDigit(line: string, index: number) {
    for (let i = 0; i < digitInfos.length; i++) {
      const value = compareText(line, index, digitInfos[i]);
      if (value !== -1) {
        return value;
      }
    }
    return -1;
  }
  console.log(`linecount: ${lines.length}`);
  // for each line
  for (let i = 0; i < lines.length; i++) {
    // console.log(lines[i]);
    // for each character
    let firstDigit = -1;
    let lastDigit = -1;
    for (let j = 0; j < lines[i].length; j++) {
      if (firstDigit === -1) {
        firstDigit = getMatchingDigit(lines[i], j);
      }
      if (lastDigit === -1) {
        lastDigit = getMatchingDigit(lines[i], lines[i].length - j - 1);
      }
    }
    const answer = `${lines[i]}:${firstDigit * 10 + lastDigit}`;
    // await pauseAndWaitForInput(answer);
    console.log(answer);
    count += firstDigit * 10 + lastDigit;
  }

  console.log(count);

  // function isDigit(character:string) {
  //   return /^\d$/.test(character);
  // }
})();
