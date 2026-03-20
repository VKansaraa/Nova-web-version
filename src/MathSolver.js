import * as math from 'mathjs';

export function solveExpression(userText) {
    const input = userText.trim();
    //basic calculator: 2+2, 5*3, (4+5)*2, etc.
    if (/^[0-9+\-*/().\s^%]+$/.test(input)) {
      try {
        const result = math.evaluate(input);
        return `Result: ${result}`;

      } catch {
        return "Sorry, I couldn't understand that input.";
      }
    }

    // 1. Detect trig: sin(30), cos 45, tan(π/4)
    if (/^(sin|cos|tan|cot|sec|csc)\s*\(?\s*[-+]?\d+(\.\d+)?\s*\)?$/i.test(input)) {
      return handleTrig(input);
    }
    // 2. Detect stats: comma-separated numbers
    if (input.includes(',')) {
        const nums = input.split(',').map(Number);
        const stats = solveStats(nums);
        return `Mean: ${stats.mean}, Median: ${stats.median}, Mode: ${stats.mode.join(', ')}, StdDev: ${stats.stdDev}, Variance: ${stats.variance}`;
    }

    // 3. Detect probability expressions like 1/6 + 1/6 or (2/3)*(3/4)
    if (input.includes('Probability')) {
        const result = solveProbability(input);
        return `Probability: ${result}`;
    }

    // 4. Detect equations: something = something
    if (input.includes('=')) {
        return solveEquation(input);
    }

    // 5. Generic math expression
    try {
        const result = math.evaluate(input);
        return `Result: ${result}`;
    } catch {
        return "Sorry, I couldn't understand that input.";
    }
}
//Helpers
function handleTrig(input) {
    const match = input.match(/(sin|cos|tan|cot|sec|csc)\s*\(?\s*(-?\d+(\.\d+)?)\s*\)?/i);
    if (!match) return "Invalid trig format.";

    const func = match[1].toLowerCase();
    const angle = parseFloat(match[2]);

    switch (func) {
        case "sin": return `sin(${angle}) = ${trigCalculate(1, angle)}`;
        case "cos": return `cos(${angle}) = ${trigCalculate(2, angle)}`;
        case "tan": return `tan(${angle}) = ${trigCalculate(3, angle)}`;
        case "cot": return `cot(${angle}) = ${trigCalculate(4, angle)}`;
        case "sec": return `sec(${angle}) = ${trigCalculate(5, angle)}`;
        case "csc": return `csc(${angle}) = ${trigCalculate(6, angle)}`;
        default: return "Unknown trig function.";
    }
}

function trigCalculate(funcNum, angle) {
    const rad = math.unit(angle, 'deg');
    switch (funcNum) {
        case 1: return math.sin(rad);
        case 2: return math.cos(rad);
        case 3: return math.tan(rad);
        case 4: return 1 / math.tan(rad);
        case 5: return 1 / math.cos(rad);
        case 6: return 1 / math.sin(rad);
        default: return 0;
    }
}

function solveStats(nums) {
    const mean = math.mean(nums);
    const median = math.median(nums);
    const mode = math.mode(nums);
    const stdDev = math.std(nums);
    const variance = math.variance(nums);
    return { mean, median, mode, stdDev, variance };
}

function solveProbability(input) {
    const expr = input.replace(/Probability\s*/i, '');
    try {
        const result = math.evaluate(expr);
        return result;
    } catch {
        return "Invalid probability expression.";
    }
}

function solveEquation(input) {
    try {
        const result = math.solve(input);
        return `Solution: ${result}`;
    } catch {
        return "Invalid equation.";
    }
}