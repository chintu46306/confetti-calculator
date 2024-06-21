import React, { useState } from "react";
import {
  evaluate,
  sqrt,
  sin,
  cos,
  tan,
  log,
  exp,
  pow,
  factorial,
  pi,
  random,
  sinh,
  cosh,
  tanh,
  log10,
} from "mathjs";
import {
  FaPlus,
  FaMinus,
  FaTimes,
  FaDivide,
  FaEquals,
  FaPercentage,
} from "react-icons/fa";
import { TbMathPi } from "react-icons/tb";

import DarkModeToggle from "./components/themeToggle";

import Confetti from "react-confetti";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [memory, setMemory] = useState(null);
  const [isOperator, setIsOperator] = useState(false);
  const [isSecond, setIsSecond] = useState(false);
  const [angleMode, setAngleMode] = useState("DEG");
  const [openParenthesesCount, setOpenParenthesesCount] = useState(0);
  const [shouldExplode, setShouldExplode] = useState(false);

  const handleButtonClick = (value) => {
    const operators = ["+", "-", "*", "/"];
    const lastChar = expression.slice(-1);

    if (!isNaN(value) || value === ".") {
      // Handle number and decimal point input
      if (display === "0" || isOperator || display === "Error") {
        setDisplay(value);
        setIsOperator(false);
      } else {
        setDisplay(display + value);
      }
      setExpression((prevExp) => prevExp + value);
    } else if (value === "C") {
      // Clear display
      setDisplay("0");
      setExpression("");
      setMemory(null);
      setOpenParenthesesCount(0);
    } else if (value === "mc") {
      // Clear memory
      setMemory(null);
    } else if (value === "m+") {
      // Add to memory
      setMemory((memory ? parseFloat(memory) : 0) + parseFloat(display));
    } else if (value === "m-") {
      // Subtract from memory
      setMemory((memory ? parseFloat(memory) : 0) - parseFloat(display));
    } else if (value === "mr") {
      // Recall memory
      setDisplay(memory ? memory.toString() : "0");
    } else if (value === "+/-") {
      // Toggle sign
      setDisplay((parseFloat(display) * -1).toString());
      setExpression((prevExp) => (parseFloat(prevExp) * -1).toString());
    } else if (value === "%") {
      // Percentage
      setDisplay((parseFloat(display) / 100).toString());
      setExpression((prevExp) => (parseFloat(prevExp) / 100).toString());
    } else if (value === "=") {
      try {
        let balancedExpression = expression;

        for (let i = 0; i < openParenthesesCount; i++) {
          balancedExpression += ")";
        }

        if (
          balancedExpression.includes("5") &&
          balancedExpression.includes("6")
        ) {
          setShouldExplode(true);

          console.log("5 and 6 detected");

          setTimeout(() => {
            setShouldExplode(false);
          }, 2000);
        }

        const result = evaluate(balancedExpression);
        setDisplay(result.toString());
        setExpression(result.toString());
        setOpenParenthesesCount(0);
        setIsOperator(true);
      } catch (error) {
        setDisplay("Error");
        setExpression("");
        setOpenParenthesesCount(0);
        console.error(error);
      }
    } else if (value === "2nd") {
      // Toggle second function
      setIsSecond(!isSecond);
    } else if (value === "Rad") {
      // Toggle angle mode
      setAngleMode(angleMode === "DEG" ? "RAD" : "DEG");
    } else if (value === "Rand") {
      // Random number
      const randomValue = random().toString();
      setDisplay(randomValue);
      setExpression(randomValue);
    } else if (value === "(") {
      setExpression((prevExp) => prevExp + value);
      setOpenParenthesesCount(openParenthesesCount + 1);
      setIsOperator(false);
    } else if (value === ")") {
      if (openParenthesesCount > 0) {
        setExpression((prevExp) => prevExp + value);
        setOpenParenthesesCount(openParenthesesCount - 1);
        setIsOperator(false);
      }
    } else if (operators.includes(value)) {
      if (operators.includes(lastChar)) {
        // If the last character is already an operator, replace it with the new operator
        setExpression(expression.slice(0, -1) + value);
      } else {
        setExpression(expression + value);
      }
      setIsOperator(true);
      setDisplay(value);
    } else if (
      [
        "x^2",
        "x^3",
        "x^y",
        "e^x",
        "10^x",
        "1/x",
        "srx",
        "crx",
        "ln",
        "log10",
        "x!",
        "sin",
        "cos",
        "tan",
        "e",
        "sinh",
        "cosh",
        "tanh",
        "pi",
      ].includes(value)
    ) {
      // Handle special functions and operators
      handleSpecialFunctions(value);
    } else if (value === "EE") {
      setExpression((prevExp) => prevExp + "*(10^");
      setDisplay(display + "E");
    } else if (value === "yrx") {
      // Handle y root x
      setExpression((prevExp) => prevExp + "^(1/");
      setDisplay("√" + display);
    }

    // checking if "Y root X" and adding the "Y" before the root
    if (expression.endsWith("^(1/")) {
      setDisplay(value + display);
    }
  };

  const handleSpecialFunctions = (func) => {
    let result;
    switch (func) {
      case "x^2":
        result = pow(parseFloat(display), 2);
        break;
      case "x^3":
        result = pow(parseFloat(display), 3);
        break;
      case "x^y":
        setExpression((prevExp) => prevExp + "^");
        setDisplay(display + "^");
        return;
      case "e^x":
        result = exp(parseFloat(display));
        break;
      case "10^x":
        result = pow(10, parseFloat(display));
        break;
      case "1/x":
        result = 1 / parseFloat(display);
        break;
      case "srx":
        result = sqrt(parseFloat(display));
        break;
      case "crx":
        result = Math.cbrt(parseFloat(display));
        break;
      case "ln":
        result = log(parseFloat(display));
        break;
      case "log10":
        result = log10(parseFloat(display));
        break;
      case "x!":
        result = factorial(parseFloat(display));
        break;
      case "sin":
        result =
          angleMode === "DEG"
            ? sin(parseFloat(display) * (pi / 180))
            : sin(parseFloat(display));
        break;
      case "cos":
        result =
          angleMode === "DEG"
            ? cos(parseFloat(display) * (pi / 180))
            : cos(parseFloat(display));
        break;
      case "tan":
        result =
          angleMode === "DEG"
            ? tan(parseFloat(display) * (pi / 180))
            : tan(parseFloat(display));
        break;
      case "e":
        result = exp(1);
        break;
      case "sinh":
        result = sinh(parseFloat(display));
        break;
      case "cosh":
        result = cosh(parseFloat(display));
        break;
      case "tanh":
        result = tanh(parseFloat(display));
        break;
      case "pi":
        result = pi;
        break;
      default:
        return;
    }
    setDisplay(result.toString());
    setExpression((prevExp) => prevExp + result);
  };

  const buttons = [
    { value: "(", label: "(" },
    { value: ")", label: ")" },
    { value: "mc", label: "MC" },
    { value: "m+", label: "M+" },
    { value: "m-", label: "M-" },
    { value: "mr", label: "MR" },
    { value: "C", label: "C" },
    { value: "+/-", label: "+/-" },
    { value: "%", label: <FaPercentage /> },
    { value: "/", label: <FaDivide /> },
    { value: "2nd", label: "2nd" },
    { value: "x^2", label: "x²" },
    {
      value: "x^3",
      label: (
        <div className="flex flex-row items-start">
          x<span className="text-[0.6em] -translate-y-2">3</span>
        </div>
      ),
    },
    {
      value: "x^y",
      label: (
        <div className="flex flex-row items-start">
          x<span className="text-[0.6em] -translate-y-2">y</span>
        </div>
      ),
    },
    {
      value: "e^x",
      label: (
        <div className="flex flex-row items-start">
          e<span className="text-[0.6em] -translate-y-2">x</span>
        </div>
      ),
    },
    {
      value: "10^x",
      label: (
        <div className="flex flex-row items-start">
          10<span className="text-[0.6em] -translate-y-2">x</span>
        </div>
      ),
    },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "*", label: <FaTimes /> },
    {
      value: "1/x",
      label: (
        <div className="flex flex-row items-center text-base">
          <span className="-translate-y-2">1</span>
          <span className="rotate-12 text-lg">/</span>
          <span className="translate-y-2">x</span>
        </div>
      ),
    },
    { value: "srx", label: "²√x" },
    { value: "crx", label: "³√x" },
    { value: "yrx", label: "ʸ√x" },
    { value: "ln", label: "ln" },
    { value: "log10", label: "log₁₀" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "-", label: <FaMinus /> },
    { value: "x!", label: "x!" },
    { value: "sin", label: "sin" },
    { value: "cos", label: "cos" },
    { value: "tan", label: "tan" },
    { value: "e", label: "e" },
    { value: "EE", label: "EE" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "+", label: <FaPlus /> },
    {
      value: "Rad",
      label: (
        <div className="flex flex-row items-start">
          {angleMode === "RAD" ? "Rad" : "Deg"}
        </div>
      ),
    },
    { value: "sinh", label: "sinh" },
    { value: "cosh", label: "cosh" },
    { value: "tanh", label: "tanh" },
    { value: "pi", label: <TbMathPi /> },
    { value: "Rand", label: "Rand" },
    { value: "0", label: "0" },
    { value: ".", label: "." },
    { value: "=", label: <FaEquals /> },
  ];

  return (
    <div className="flex flex-col font-roboto dark:bg-gray-950 bg-white h-screen">
      <DarkModeToggle />
      {shouldExplode && (
        <Confetti
          className="w-screen h-screen overflow-hidden"
          tweenDuration={2000}
          width={1920}
          height={1080}
          recycle={false}
          numberOfPieces={600}
        />
      )}
      <div className="m-5 flex flex-col rounded-xl dark:bg-gray-900 bg-gray-100 shadow-xl mx-auto max-w-[900px] overflow-hidden border-2 dark:border-gray-800 border-gray-500">
        <div className="flex gap-2 p-3">
          <div className="h-4 w-4 rounded-full bg-red-500"></div>
          <div className="h-4 w-4 rounded-full bg-amber-500"></div>
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
        </div>
        <input
          type="text"
          className="rounded-xl mx-4 border-none dark:bg-gray-900 bg-gray-100 text-right text-5xl dark:text-white text-black outline-none"
          value={display}
          readOnly
        />
        <div className="grid grid-cols-10 gap-[2px] text-2xl dark:text-white text-black">
          {buttons.map((button, index) => (
            <button
              key={index}
              className={`
                hover:opacity-95
                active:opacity-80
                ${button.value == 0 ? "col-span-2" : "col-span-1"}
                flex items-center justify-center p-5 ${
                  ["/", "*", "-", "+", "="].includes(button.value)
                    ? "dark:bg-orange-400 bg-orange-300"
                    : [
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "0",
                        ".",
                      ].includes(button.value)
                    ? "dark:bg-gray-500 bg-gray-300"
                    : "dark:bg-gray-700 bg-gray-400"
                }`}
              onClick={() => handleButtonClick(button.value)}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
