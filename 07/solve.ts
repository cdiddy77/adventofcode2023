import fs from "fs";

const lines: string[] = fs.readFileSync("07/input.txt", "utf8").split("\n");

console.log(lines);

const ranks = {
  "2": 1,
  "3": 2,
  "4": 3,
  "5": 4,
  "6": 5,
  "7": 6,
  "8": 7,
  "9": 8,
  T: 9,
  J: 10,
  Q: 11,
  K: 12,
  A: 13,
};
type Rank = keyof typeof ranks;

interface Hand {
  hand: string;
  bid: number;
  type: number;
}

function compare(a: Hand, b: Hand): number {
  let diff = a.type - b.type;
  if (diff != 0) {
    return diff;
  }
  let index = 0;
  while (diff === 0 && index < 5) {
    diff = ranks[a.hand[index] as Rank] - ranks[b.hand[index] as Rank];
    index++;
  }
  return diff;
}

function parseHand(line: string): Hand {
  const [hand, bidTxt] = line.split(" ");
  const bid = parseInt(bidTxt);

  const map = new Map<string, number>();
  for (const card of hand) {
    const count = map.get(card) || 0;
    map.set(card, count + 1);
  }
  const sortedMap = [...map.entries()].sort((a, b) => b[1] - a[1]);
  let type = 0;
  if (sortedMap[0][1] === 5) {
    type = 6;
  } else if (sortedMap[0][1] === 4) {
    type = 5;
  } else if (sortedMap[0][1] === 3) {
    if (sortedMap[1][1] === 2) {
      type = 4;
    } else {
      type = 3;
    }
  } else if (sortedMap[0][1] === 2) {
    if (sortedMap[1][1] === 2) {
      type = 2;
    } else {
      type = 1;
    }
  }
  return { hand, bid, type };
}

const hands = lines.map(parseHand);
console.log("hands", hands);
const sortedHands = hands.sort(compare);
console.log("sortedHands", sortedHands);

const total = sortedHands.reduce((acc, hand, i) => acc + hand.bid * (i + 1), 0);

console.log("total", total);
