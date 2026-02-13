import { Observable /*Observer*/ } from "../include/observable.js";

// Extra Credit Functions

export function classifyObservables(obsArr: (Observable<string> | Observable<number> | Observable<boolean>)[]): {
  string: Observable<string>;
  number: Observable<number>;
  boolean: Observable<boolean>;
} {
  // TODO: Implement this function
  const strObser = new Observable<string>();
  const numObser = new Observable<number>();
  const boolObser = new Observable<boolean>();
  obsArr.forEach((e: Observable<string> | Observable<number> | Observable<boolean>) =>
    e.subscribe((x: string | number | boolean) => {
      if (typeof x === "string") {
        strObser.update(x);
      } else if (typeof x === "number") {
        numObser.update(x);
      } else {
        // (typeof(x) === "boolean")
        boolObser.update(x);
      }
    })
  );
  return { string: strObser, number: numObser, boolean: boolObser };
}

export function obsStrCond(
  funcArr: ((arg1: string) => string)[],
  f: (arg1: string) => boolean,
  o: Observable<string>
): Observable<string> {
  const retObserv = new Observable<string>();
  o.subscribe((x: string) => {
    let retStr = "";
    if (f((retStr = funcArr.reduce((acc: string, e: (s: string) => string) => e(acc), x)))) retObserv.update(retStr);
    else retObserv.update(x);
  });
  return retObserv;
}

export function statefulObserver(o: Observable<number>): Observable<number> {
  const retObserv = new Observable<number>();
  let prevNum = Number.MAX_VALUE;
  o.subscribe((x: number) => {
    const divisByPrev = x % prevNum === 0;
    prevNum = x;
    if (divisByPrev) retObserv.update(x);
  });
  return retObserv;
}

// Optional Additional Practice

// export function mergeMax(_o1: Observable<number>, _o2: Observable<number>): Observable<{ obs: number; v: number }> {
//   // TODO: Implement this function
//   return new Observable();
// }

// export function merge(_o1: Observable<string>, _o2: Observable<string>): Observable<string> {
//   // TODO: Implement this function
//   return new Observable();
// }

// export class GreaterAvgObservable extends Observable<number> {
//   constructor() {
//     super();
//   }

//   greaterAvg(): Observable<number> {
//     // TODO: Implement this method
//     return new Observable();
//   }
// }

// export class SignChangeObservable extends Observable<number> {
//   constructor() {
//     super();
//   }

//   signChange(): Observable<number> {
//     // TODO: Implement this method
//     return new Observable();
//   }
// }

// /**
//  * This function shows how the class you created above could be used.
//  * @param numArr Array of numbers
//  * @param f Observer function
//  */
// export function usingSignChange(_numArr: number[], _f: Observer<number>) {
//   // TODO: Implement this function
// }
