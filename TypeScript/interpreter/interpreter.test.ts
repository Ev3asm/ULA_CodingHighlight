import { parseExpression, parseProgram } from "../include/parser.js";
import { PARENT_STATE_KEY, State, interpExpression, interpProgram } from "./interpreter.js";

function expectStateToBe(program: string, state: State) {
  expect(interpProgram(parseProgram(program))).toEqual(state);
}

describe("interpExpression", () => {
  it("evaluates multiplication with a variable", () => {
    const r = interpExpression({ x: 10 }, parseExpression("x * 2"));

    expect(r).toEqual(20);
  });

  it("division by 0 is prohibited", () => {
    // Division by zero is forbidden
    expect(() => interpExpression({ x: 10 }, parseExpression("x / 0"))).toThrow(
      "division by 0 is an illegal expression"
    );
  });

  it("correctly applies PEMDAS", () => {
    const r = interpExpression({ x: 10, y: 5, z: -1 }, parseExpression("x / (2 - z) + 5"));

    expect(r).toBeCloseTo(8.3333333, 3);
  });

  it("searches through the state to find the correct value", () => {
    const r = interpExpression({ [PARENT_STATE_KEY]: { x: 10 }, y: 5, z: -1 }, parseExpression("x / (2 - z) + 5"));
    expect(r).toBeCloseTo(8.3333333, 3);

    const s = interpExpression(
      { [PARENT_STATE_KEY]: { [PARENT_STATE_KEY]: { y: 2 }, z: 8 }, x: 3, y: 5 },
      parseExpression("(y - x) / z")
    );
    expect(s).toBeCloseTo(0.25, 6);
  });

  it("should through an error if the variable does not exist", () => {
    // variable does not exist
    expect(() => interpExpression({ y: 5, z: -1 }, parseExpression("3 - 5 / x"))).toThrow(
      `variable x does not exist in memory`
    );
  });

  it("should throw an error if arithmetic or comparison operators have a boolean operand", () => {
    // Arithmetic and greater/less-than comparison may only happen between numbers
    expect(() => interpExpression({}, parseExpression("3 + false"))).toThrow(
      "Arithmetic and numerical comparisons may only happen between numbers"
    );

    expect(() => interpExpression({ z: 0 }, parseExpression("z < true"))).toThrow(
      "Arithmetic and numerical comparisons may only happen between numbers"
    );
  });

  it("should throw an error if logical operators have a number operand", () => {
    // Logical operations should short-circuit (short-cut). Evaluated operands must be boolean values
    expect(() => interpExpression({}, parseExpression("true && 100"))).toThrow(
      "Logical operations may only happen between booleans"
    );

    expect(() => interpExpression({ x: 0 }, parseExpression("x || false"))).toThrow(
      "Logical operations may only happen between booleans"
    );
  });

  // Additional checks to emulate ReferenceError behavior are unneeded
  // This would require an additional pass prior to interpreting to ensure variables are not used before declaration
  // See MDN on Hoisting if you are curious
});

describe("interpStatement", () => {
  it("should correctly update state during a let", () => {
    expectStateToBe("let x = 10;", { x: 10 });
  });

  it("should throw an error if no variable exists for the assignment", () => {
    expect(() => expectStateToBe("x = 10;", {})).toThrow("variable x does not exist in memory");
  });
  // let, assignment, if, while, print
}); // changing variable types

describe("interpProgram", () => {
  it("handles declarations and reassignment", () => {
    // TIP: Use the grave accent to define multiline strings
    expectStateToBe(
      `      
      let x = 10;
      x = 20;
    `,
      { x: 20 }
    );
  });

  it("correctly moves through if statements", () => {
    // TIP: Use the grave accent to define multiline strings
    expectStateToBe(
      `      
      let x = 10;
      let y = true;
      if (x < 5) {
        y = false;
      } else {}
      if (x / 4 < 3){
        let y = 0;
        x = 12;
        y = 2;
      } else {
        x = x + 10;
      }
    `,
      { x: 12, y: true }
    );
  });

  it("correctly moves through while statements", () => {
    // TIP: Use the grave accent to define multiline strings
    expectStateToBe(
      `      
      let x = 0;
      while (x < 14){
        x = x + 3;
      }
    `,
      { x: 15 }
    );
  });

  it("correctly moves through a nested if and while statement", () => {
    // TIP: Use the grave accent to define multiline strings
    expectStateToBe(
      `      
      let x = 25;
      let y = x;
      let z = 0;
      while (x > 10){
        if (z + 2 < 0 || y === x){
          x = x - 10;
        } else {
          if (z > 5){
            y = y + 1;
          } else {
            z = z - 1;
          }
        }
      }
    `,
      { x: 5, y: 25, z: -3 }
    );
  });

  it("correctly moves through a program", () => {
    // TIP: Use the grave accent to define multiline strings
    expectStateToBe(
      `      
      let x = 25;
      let y = x;
      let z = 0;
      while (y > 1){
        z = z + 1;
        y = y / 2;
      }
      y = 1;
      while (z > 1){
        y = y * 2;
        z = z - 1;
      }
      let ans = 0;
      if (y === x){
        ans = true;
      } else {
        ans = false;
      }
    `,
      { x: 25, y: 16, z: 1, ans: false }
    );
  });
});
