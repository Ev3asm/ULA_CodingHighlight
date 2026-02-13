import { BinaryOperator, Expression, Statement } from "../include/parser.js";

type RuntimeValue = number | boolean;
export const PARENT_STATE_KEY = Symbol("[[PARENT]]");
export type State = { [PARENT_STATE_KEY]?: State; [key: string]: RuntimeValue };

function searchState(state: State | undefined, varName: string, changeTo?: number | boolean): number | boolean {
  if (state === undefined) {
    throw new Error(`variable ${varName} does not exist in memory`);
  } else if (varName in state) {
    if (typeof changeTo !== "undefined") {
      state[varName] = changeTo;
    }
    return state[varName];
  } else {
    return searchState(state[PARENT_STATE_KEY], varName, changeTo);
  }
}

function evalOper(
  state: State,
  exp: { kind: "operator"; operator: BinaryOperator; left: Expression; right: Expression }
): RuntimeValue {
  function checkBool(expVal: unknown): boolean {
    if (typeof expVal === "boolean") {
      return expVal;
    } else {
      throw new Error("Logical operations may only happen between booleans");
    }
  }

  function checkNum(expVal: unknown): number {
    if (typeof expVal === "number") {
      return expVal;
    } else {
      throw new Error("Arithmetic and numerical comparisons may only happen between numbers");
    }
  }

  switch (exp.operator) {
    case "&&":
      return checkBool(interpExpression(state, exp.left)) && checkBool(interpExpression(state, exp.right));
    case "||":
      return checkBool(interpExpression(state, exp.left)) || checkBool(interpExpression(state, exp.right));
    case "+":
      return checkNum(interpExpression(state, exp.left)) + checkNum(interpExpression(state, exp.right));
    case "-":
      return checkNum(interpExpression(state, exp.left)) - checkNum(interpExpression(state, exp.right));
    case "*":
      return checkNum(interpExpression(state, exp.left)) * checkNum(interpExpression(state, exp.right));
    case "/":
      let right: number;
      if ((right = checkNum(interpExpression(state, exp.right))) === 0) {
        throw new Error("division by 0 is an illegal expression");
      }
      return checkNum(interpExpression(state, exp.left)) / right;
    case ">":
      return checkNum(interpExpression(state, exp.left)) > checkNum(interpExpression(state, exp.right));
    case "<":
      return checkNum(interpExpression(state, exp.left)) < checkNum(interpExpression(state, exp.right));
    case "===":
      return interpExpression(state, exp.left) === interpExpression(state, exp.right);
  }
}

export function interpExpression(state: State, exp: Expression): RuntimeValue {
  switch (exp.kind) {
    case "number":
    case "boolean":
      return exp.value;
    case "variable":
      return searchState(state, exp.name);
    case "operator":
      return evalOper(state, exp);
    // below are optional
    case "function":
    case "call":
    default:
      throw new Error("unknown expression kind");
  }
}

export function interpStatement(state: State, stmt: Statement): void {
  const newState = { [PARENT_STATE_KEY]: state };
  switch (stmt.kind) {
    case "let":
      if (stmt.name in state) {
        throw new Error(`duplicate declaration: ${stmt.name}`);
      } else {
        state[stmt.name] = interpExpression(state, stmt.expression);
        break;
      }
    case "assignment":
      searchState(state, stmt.name, interpExpression(state, stmt.expression));
      break;
    case "if":
      if (interpExpression(state, stmt.test)) {
        stmt.truePart.forEach(newStmt => interpStatement(newState, newStmt));
      } else {
        stmt.falsePart.forEach(newStmt => interpStatement(newState, newStmt));
      }
      break;
    case "while":
      while (interpExpression(state, stmt.test)) {
        stmt.body.forEach(newStmt => interpStatement(newState, newStmt));
      }
      break;
    case "print":
      console.log(interpExpression(state, stmt.expression));
      break;
    // below are optional
    case "expression":
    case "return":
    default:
      throw new Error("unknown statement kind");
  }
}

export function interpProgram(program: Statement[]): State {
  const state = {};
  program.forEach(e => interpStatement(state, e));
  return state;
}
