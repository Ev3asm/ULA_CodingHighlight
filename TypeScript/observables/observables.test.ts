import assert from "assert";
import { Observable /*Observer*/ } from "../include/observable.js";
import {
  classifyObservables,
  obsStrCond,
  statefulObserver /*,
  mergeMax,
  merge,
  GreaterAvgObservable,
  SignChangeObservable,
  usingSignChange,*/,
} from "./observables.js";

/*
Write a function classifyObservables that takes in an array obsArr of Observables where each Observable updates with a type string, number,
 or boolean. Return an object with three observables, one for each named type. Each of the three observables updates anytime an Observable 
 of that type in the input array updates.
*/
describe("classifyObservables", () => {
  it("classifies a single number observable", () => {
    const n = new Observable<number>();

    const { string, number, boolean } = classifyObservables([n]);
    const spyStr = jest.fn();
    const spyNum = jest.fn();
    const spyBool = jest.fn();
    string.subscribe(spyStr);
    number.subscribe(spyNum);
    boolean.subscribe(spyBool);

    n.update(1);

    expect(spyStr).toHaveBeenCalledTimes(0);
    expect(spyNum).toHaveBeenCalledTimes(1);
    expect(spyBool).toHaveBeenCalledTimes(0);
  });

  // More tests go here.

  it("classifies a single string, number, and boolean observable and updates only once", () => {
    const str = new Observable<string>();
    const num = new Observable<number>();
    const bool = new Observable<boolean>();

    const { string, number, boolean } = classifyObservables([bool, str, num]);
    const spyStr = jest.fn();
    const spyNum = jest.fn();
    const spyBool = jest.fn();
    string.subscribe(spyStr);
    number.subscribe(spyNum);
    boolean.subscribe(spyBool);

    str.update("1");
    num.update(1);
    bool.update(true);

    expect(spyStr).toHaveBeenCalledTimes(1);
    expect(spyNum).toHaveBeenCalledTimes(1);
    expect(spyBool).toHaveBeenCalledTimes(1);
  });

  it("classifies a multiple string, number, and boolean observable and updates multiple times", () => {
    const str1 = new Observable<string>();
    const str2 = new Observable<string>();
    const str3 = new Observable<string>();
    const num1 = new Observable<number>();
    const num2 = new Observable<number>();
    const bool1 = new Observable<boolean>();
    const bool2 = new Observable<boolean>();

    const { string, number, boolean } = classifyObservables([str3, num2, bool1, num1, str1, str2, bool2]);
    const spyStr = jest.fn();
    const spyNum = jest.fn();
    const spyBool = jest.fn();
    string.subscribe(spyStr);
    number.subscribe(spyNum);
    boolean.subscribe(spyBool);

    str1.update("1");
    num1.update(1);
    bool1.update(true);
    str3.update("hello world");
    bool1.update(false);
    str2.update("today is Nov. 3");
    num2.update(8);
    str3.update("hey hey hey, there's a better way to live!");
    str1.update("Hope this passes");
    num2.update(100);
    bool1.update(true);

    expect(spyStr).toHaveBeenCalledTimes(5);
    expect(spyNum).toHaveBeenCalledTimes(3);
    expect(spyBool).toHaveBeenCalledTimes(3);
  });
});

/* 
Write a function obsStrCond that takes a nonempty array funcArr of functions with type string => string, a function f with type string => 
boolean, and an Observable o with type Observable<string>. It returns an Observable<string> that updates when o updates, in the following way.
If f returns true for the string obtained by applying the composition of the functions in funcArr (with the function at index 0 being applied 
first) to the update value of o, then the returned observable should update with that string. If f returns false, update the returned 
observable with the unchanged update value of o.
*/
describe("obsStrCond", () => {
  // More tests go here.
  it("should update only if f(x) is true if funcArr is empty", () => {
    const funcArr: ((s: string) => string)[] = [];
    const f: (s: string) => boolean = (s: string) => s.includes("s");
    const origObs = new Observable<string>();
    const condObs: Observable<string> = obsStrCond(funcArr, f, origObs);

    const spy = jest.fn();
    condObs.subscribe(spy);
    let str = "";
    condObs.subscribe((s: string) => (str = s));

    origObs.update("hello");
    expect(str).toBe("hello");
    origObs.update("sunshine");
    expect(str).toBe("sunshine");
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("should return a string depending on funcArr", () => {
    const funcArr: ((s: string) => string)[] = [s => s.toLowerCase(), s => s.substring(3), s => s.concat("!")];
    const f: (s: string) => boolean = (s: string) => s.startsWith("s") && s.length > 4;
    const origObs = new Observable<string>();
    const condObs: Observable<string> = obsStrCond(funcArr, f, origObs);

    const spy = jest.fn();
    condObs.subscribe(spy);
    let str = "";
    condObs.subscribe((s: string) => (str = s));

    origObs.update("hello");
    expect(str).toBe("hello");
    origObs.update("sunshine");
    expect(str).toBe("shine!");
    origObs.update("sassy");
    expect(str).toBe("sassy");
    origObs.update("pressure and entropy are state properties");
    expect(str).toBe("ssure and entropy are state properties!");
    expect(spy).toHaveBeenCalledTimes(4);
  });

  it("should confirm that the funArr applies left to right", () => {
    const funcArr: ((s: string) => string)[] = [s => "!".concat(s), s => s.substring(3)];
    const f: (s: string) => boolean = (s: string) => s.length > 2;
    const origObs = new Observable<string>();
    const condObs: Observable<string> = obsStrCond(funcArr, f, origObs);

    const spy = jest.fn();
    condObs.subscribe(spy);
    let str = "";
    condObs.subscribe((s: string) => (str = s));

    origObs.update("hello");
    expect(str).toBe("llo");
    origObs.update("sunshine");
    expect(str).toBe("nshine");
    expect(spy).toHaveBeenCalledTimes(2);
  });
});

/*
Write a function statefulObserver that takes an Observable<number> o as input and returns a new Observable<number> which only updates if the 
current update value from o is divisible by the previous update value from o.
*/
describe("statefulObserver", () => {
  it("should not update after the first value", () => {
    const origObs = new Observable<number>();
    const divisObs = statefulObserver(origObs);

    const spy = jest.fn();
    divisObs.subscribe(spy);

    origObs.update(10);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it("should update for all other values if update value is divisible by previous after the first value", () => {
    const origObs = new Observable<number>();
    const divisObs = statefulObserver(origObs);

    const spy = jest.fn();
    let num = 0;
    divisObs.subscribe(spy);
    divisObs.subscribe(x => (num = x));

    origObs.update(10);
    expect(num).toBe(0);
    origObs.update(2);
    expect(num).toBe(0);
    origObs.update(-8);
    expect(num).toBe(-8);
    origObs.update(32);
    expect(num).toBe(32);
    origObs.update(0);
    expect(num).toBe(0);
    origObs.update(10);
    expect(num).toBe(0);
    origObs.update(10);
    expect(num).toBe(10);

    expect(spy).toHaveBeenCalledTimes(4);
  });
});

describe("mergeMax", () => {
  // More tests go here.
});

describe("merge", () => {
  // More tests go here.
});

describe("GreaterAvgObservable", () => {
  // More tests go here.
});

describe("SignChangeObservable", () => {
  // More tests go here.
});

describe("usingSignChange", () => {
  // More tests go here.
  it("should do as I say", () => {
    const N = 10
    const arr = [0, 9, 2, 3, 1, 6, 5, 8, 4, 7]

    const freq = new Array(N).fill(0);
    assert(arr.length === N);
    arr.forEach(e => assert(++freq[e] === 1));
    //assert(freq.every(e => e === 1));
  })
});
