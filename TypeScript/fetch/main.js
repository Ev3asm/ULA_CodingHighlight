import { makeSearchURL } from "./utility.js";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });
let check = true;
let factLength = 0,
  factAmount = 0;
while (check) {
  factAmount = await rl.question("How many cat facts do you want (at least 1)? ");
  factLength = await rl.question("How many characters long do you want your cat facts (20 or above)? ");
  if (factLength >= 20 && factAmount >= 1) {
    check = false;
  } else {
    console.log("Needs length >= 20 and fact >= 1");
  }
}
rl.close();

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

const catsURL = makeSearchURL("https://catfact.ninja/fact", ["max_length"], [factLength]);

export function getReadData() {
  return fetch(catsURL)
    .then(res => (res.ok ? res.json() : Promise.reject(new Error("Error in response: ${response.statusText}"))))
    .then(json =>
      isEmpty(json)
        ? Promise.reject(new Error("Empty object length is less than 20"))
        : Promise.resolve({ fact: json.fact })
    );
}

let count = 0;
while (count < factAmount) {
  const data = await getReadData();
  console.log(data.fact);
  count++;
}
