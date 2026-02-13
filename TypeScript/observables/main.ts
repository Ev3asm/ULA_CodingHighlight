import { Observable, Observer } from "../include/observable.js";
import { classifyObservables } from "./observables.js";

const strObs1: Observable<string> = new Observable();
const strObs2: Observable<string> = new Observable();
const numObs1: Observable<number> = new Observable();
const numObs2: Observable<number> = new Observable();
const boolObs1: Observable<boolean> = new Observable();
const boolObs2: Observable<boolean> = new Observable();

let { string, number, boolean } = classifyObservables([strObs1, strObs2, numObs1, numObs2, boolObs1, boolObs2]);

string.subscribe(val => console.log(`STR: ${val}`));
number.subscribe(val => console.log(`NUM: ${val}`));
boolean.subscribe(val => console.log(`BOOL: ${val}`));

strObs1.update("Hello World");
numObs1.update(1);
boolObs1.update(true);
boolObs2.update(false);
numObs2.update(2);
strObs2.update("Bye.");


// let o1 = new Observable<number>;
// // more code here
// // o1.subscribe(x => x % 2 > 0 ? console.log(x) : 0);
// let o2 = o1.filter(x => x % 2 > 0);
// // o1.subscribe(x => o2.update(x));
// o2.subscribe(console.log);
// // o1.filter(x => x % 2 > 0).subscribe(console.log);

// [1,2,3,4].forEach(e => o1.update(e));

const f = (x: number) => Math.abs(x) * 4;
const g = (x: number) => x < 0;
const o1 = new Observable<number>; 
const o2 = o1.filter(g);
const o3 = o2.map(f); 
o3.subscribe(console.log)
o1.update(-6.5);