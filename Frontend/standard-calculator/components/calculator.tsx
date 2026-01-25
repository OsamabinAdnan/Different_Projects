// Enable client-side rendering in Next.js
'use client'

// Import necessary React hooks and components
import React, { ChangeEvent, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
// Import icons for theme toggle
import { Sun, Moon, Plus, Minus, X, Divide, RotateCcw, History, Hash, Percent, Equal, ArrowLeft, ArrowRight, Pi, Calculator as CalcIcon, Square } from 'lucide-react'
import ThreeJSVisualization from './ThreeJSVisualization'

// Main Calculator component
export default function Calculator() {
    // State management using useState hooks
    const [firstOperand, setFirstOperand] = useState<string>('') // First operand
    const [secondOperand, setSecondOperand] = useState<string>('') // Second operand
    const [result, setResult] = useState<string>('') // Calculation result
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false) // Theme toggle state
    const [error, setError] = useState<string>('') // Error message state
    const [mounted, setMounted] = useState(false) // Component mount state for animations
    const [history, setHistory] = useState<Array<{operation: string, num1: string, num2: string, result: string}>>([]) // Calculation history
    const [currentOperation, setCurrentOperation] = useState<string | null>(null) // Current operation
    const [memory, setMemory] = useState<number>(0) // Memory function
    const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg') // Angle mode (degrees/radians)
    const [display, setDisplay] = useState<string>('0') // Display value
    const [expression, setExpression] = useState<string>('') // Full expression
    const [lastResult, setLastResult] = useState<number | null>(null) // Last calculation result
    const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false) // Whether we're waiting for the second operand

    // Effect to handle component mounting animation
    useEffect(() => {
        setMounted(true)
    }, [])

    // Function to toggle between light and dark theme
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode)
        document.documentElement.classList.toggle('dark')
    }

    // Function to reset all states
    const resetCalculator = (): void => {
        setFirstOperand('');
        setSecondOperand('');
        setResult('');
        setCurrentOperation(null);
        setWaitingForSecondOperand(false);
        setError('');
    }

    // Function to input a number
    const inputDigit = (digit: string) => {
        if (waitingForSecondOperand) {
            setSecondOperand(prev => prev === '0' ? digit : prev + digit);
            setDisplay(prev => prev === '0' ? digit : prev + digit);
        } else {
            setFirstOperand(prev => prev === '0' ? digit : prev + digit);
            setDisplay(prev => prev === '0' ? digit : prev + digit);
        }
    }

    // Function to input decimal point
    const inputDecimal = () => {
        if (waitingForSecondOperand) {
            if (!secondOperand.includes('.')) {
                setSecondOperand(prev => prev + '.');
                setDisplay(prev => prev + '.');
            }
        } else {
            if (!firstOperand.includes('.')) {
                setFirstOperand(prev => prev + '.');
                setDisplay(prev => prev + '.');
            }
        }
    }

    // Function to clear entry
    const clearEntry = () => {
        if (waitingForSecondOperand) {
            setSecondOperand('');
            setDisplay('0');
        } else {
            setFirstOperand('');
            setDisplay('0');
        }
    }

    // Function to clear all
    const clearAll = () => {
        resetCalculator();
        setDisplay('0');
    }

    // Backspace function
    const backspace = () => {
        if (waitingForSecondOperand) {
            if (secondOperand.length > 1) {
                const newSecondOperand = secondOperand.slice(0, -1);
                setSecondOperand(newSecondOperand);
                setDisplay(newSecondOperand || '0');
            } else {
                setSecondOperand('');
                setDisplay('0');
            }
        } else {
            if (firstOperand.length > 1) {
                const newFirstOperand = firstOperand.slice(0, -1);
                setFirstOperand(newFirstOperand);
                setDisplay(newFirstOperand || '0');
            } else {
                setFirstOperand('');
                setDisplay('0');
            }
        }
    }

    // Function to perform calculation
    const performCalculation = (): void => {
        if (!currentOperation || !firstOperand || !secondOperand) return;

        const operand1 = parseFloat(firstOperand);
        const operand2 = parseFloat(secondOperand);

        if (isNaN(operand1) || isNaN(operand2)) {
            setError('Invalid operands');
            return;
        }

        let resultValue: number;
        let opSymbol = currentOperation;

        try {
            switch (currentOperation) {
                case '+':
                    resultValue = operand1 + operand2;
                    break;
                case '-':
                    resultValue = operand1 - operand2;
                    break;
                case '×':
                    resultValue = operand1 * operand2;
                    break;
                case '÷':
                    if (operand2 === 0) {
                        setError('Division by zero is not allowed');
                        return;
                    }
                    resultValue = operand1 / operand2;
                    break;
                default:
                    throw new Error('Unknown operation');
            }

            const resultStr = resultValue.toString();
            setResult(resultStr);
            setLastResult(resultValue);

            // Add to history
            setHistory(prev => [{operation: opSymbol, num1: firstOperand, num2: secondOperand, result: resultStr}, ...prev.slice(0, 9)]);

            // Update display
            setDisplay(resultStr);

            // Reset for next calculation
            setFirstOperand(resultStr);
            setSecondOperand('');
            setWaitingForSecondOperand(false);
            setCurrentOperation(null);
            setError('');
        } catch (err) {
            setError(`Calculation error occurred: ${err}`);
        }
    }

    // Function to handle operation
    const handleOperation = (op: string) => {
        if (firstOperand && !waitingForSecondOperand) {
            setCurrentOperation(op);
            setWaitingForSecondOperand(true);
            setExpression(`${firstOperand} ${op}`);
        } else if (firstOperand && secondOperand && currentOperation) {
            // If there's already a calculation waiting, perform it first
            performCalculation();
            // Then set up the new operation
            setCurrentOperation(op);
            setWaitingForSecondOperand(true);
            setExpression(`${result} ${op}`);
        }
    }

    // Mathematical operations with input validation and error handling

    // Addition operation
    const add = (): void => {
        handleOperation('+');
    }

    // Subtraction operation
    const subtract = (): void => {
        handleOperation('-');
    }

    // Multiplication operation
    const multiply = (): void => {
        handleOperation('×');
    }

    // Division operation with zero division check
    const divide = (): void => {
        handleOperation('÷');
    }

    // Function to reset all states
    const clear = (): void => {
        resetCalculator();
        setDisplay('0');
    }

    // Memory functions
    const memoryAdd = () => {
        if (result) {
            setMemory(prev => prev + parseFloat(result))
        }
    }

    const memorySubtract = () => {
        if (result) {
            setMemory(prev => prev - parseFloat(result))
        }
    }

    const memoryRecall = () => {
        if (!waitingForSecondOperand) {
            setFirstOperand(memory.toString());
        } else {
            setSecondOperand(memory.toString());
        }
        setDisplay(memory.toString());
    }

    const memoryClear = () => {
        setMemory(0)
    }

    // Advanced scientific functions
    const calculateScientific = (func: string) => {
        const currentValue = parseFloat(display) || 0;
        let calculatedValue = 0;
        let opSymbol = '';

        try {
            switch(func) {
                case 'sin':
                    calculatedValue = Math.sin(angleMode === 'deg' ? currentValue * Math.PI / 180 : currentValue);
                    opSymbol = `sin(${currentValue}${angleMode === 'deg' ? '°' : ' rad'})`;
                    break;
                case 'cos':
                    calculatedValue = Math.cos(angleMode === 'deg' ? currentValue * Math.PI / 180 : currentValue);
                    opSymbol = `cos(${currentValue}${angleMode === 'deg' ? '°' : ' rad'})`;
                    break;
                case 'tan':
                    calculatedValue = Math.tan(angleMode === 'deg' ? currentValue * Math.PI / 180 : currentValue);
                    opSymbol = `tan(${currentValue}${angleMode === 'deg' ? '°' : ' rad'})`;
                    break;
                case 'asin':
                    calculatedValue = angleMode === 'deg' ? Math.asin(currentValue) * 180 / Math.PI : Math.asin(currentValue);
                    opSymbol = `asin(${currentValue})`;
                    break;
                case 'acos':
                    calculatedValue = angleMode === 'deg' ? Math.acos(currentValue) * 180 / Math.PI : Math.acos(currentValue);
                    opSymbol = `acos(${currentValue})`;
                    break;
                case 'atan':
                    calculatedValue = angleMode === 'deg' ? Math.atan(currentValue) * 180 / Math.PI : Math.atan(currentValue);
                    opSymbol = `atan(${currentValue})`;
                    break;
                case 'log':
                    calculatedValue = Math.log10(currentValue);
                    opSymbol = `log(${currentValue})`;
                    break;
                case 'ln':
                    calculatedValue = Math.log(currentValue);
                    opSymbol = `ln(${currentValue})`;
                    break;
                case 'sqrt':
                    calculatedValue = Math.sqrt(currentValue);
                    opSymbol = `√(${currentValue})`;
                    break;
                case 'square':
                    calculatedValue = Math.pow(currentValue, 2);
                    opSymbol = `(${currentValue})²`;
                    break;
                case 'cube':
                    calculatedValue = Math.pow(currentValue, 3);
                    opSymbol = `(${currentValue})³`;
                    break;
                case 'pow10':
                    calculatedValue = Math.pow(10, currentValue);
                    opSymbol = `10^(${currentValue})`;
                    break;
                case 'exp':
                    calculatedValue = Math.exp(currentValue);
                    opSymbol = `e^(${currentValue})`;
                    break;
                case 'abs':
                    calculatedValue = Math.abs(currentValue);
                    opSymbol = `|${currentValue}|`;
                    break;
                case 'factorial':
                    if (currentValue < 0 || !Number.isInteger(currentValue)) {
                        throw new Error('Factorial is only defined for non-negative integers');
                    }
                    calculatedValue = Array.from({ length: Math.floor(currentValue) }, (_, i) => i + 1)
                                           .reduce((acc, val) => acc * val, 1) || 1;
                    opSymbol = `${currentValue}!`;
                    break;
                default:
                    throw new Error('Unknown function');
            }

            const resultStr = calculatedValue.toString();
            setDisplay(resultStr);
            setResult(resultStr);
            setLastResult(calculatedValue);
            setHistory(prev => [{operation: opSymbol, num1: currentValue.toString(), num2: '', result: resultStr}, ...prev.slice(0, 9)]);
        } catch (err) {
            setError(`Error in ${func}: ${err}`);
        }
    };

    // Constants
    const insertConstant = (constant: string) => {
        switch(constant) {
            case 'pi':
                setDisplay(Math.PI.toString());
                break;
            case 'e':
                setDisplay(Math.E.toString());
                break;
            case 'phi':
                setDisplay(((1 + Math.sqrt(5)) / 2).toString());
                break;
            default:
                break;
        }
    };

    // Percentage function
    const calculatePercentage = () => {
        const currentValue = parseFloat(display) || 0;
        const percentageValue = currentValue / 100;
        setDisplay(percentageValue.toString());
        setResult(percentageValue.toString());
        setLastResult(percentageValue);
        setHistory(prev => [{operation: '%', num1: currentValue.toString(), num2: '', result: percentageValue.toString()}, ...prev.slice(0, 9)]);
    };

    // Toggle angle mode
    const toggleAngleMode = () => {
        setAngleMode(prev => prev === 'deg' ? 'rad' : 'deg');
    };

    
    
    // Main UI render function
    return (
        // Main container with responsive layout and theme support
        <div className='relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 p-4'>
            {/* 3D Background Visualization */}
            <div className="absolute inset-0 -z-10">
                <ThreeJSVisualization
                    result={result ? parseFloat(result) : null}
                    operation={currentOperation}
                />
            </div>

            {/* Theme toggle button */}
            <Button
                onClick={toggleTheme}
                className='absolute top-4 right-4 p-2 rounded-full hover:scale-110 transition-transform shadow-lg z-10'
                variant='ghost'
            >
                {/* Dynamic theme icon based on current mode */}
                {isDarkMode ? (
                    <Sun className='h-6 w-6 text-yellow-400 animate-spin-once' />
                ) : (
                    <Moon className='h-6 w-6 text-blue-500 animate-pulse' />
                )}
            </Button>

            {/* Main calculator card with animations */}
            <Card className={`w-full max-w-2xl p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl rounded-2xl
                ${mounted ? 'animate-float' : 'opacity-0'}
                transition-all duration-300 hover:shadow-3xl relative z-10`}>
                {/* Calculator title */}
                <CardHeader>
                    <CardTitle className='text-3xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                        Advanced Calculator
                    </CardTitle>
                </CardHeader>

                {/* Calculator content */}
                <CardContent className='space-y-6'>
                    {/* Memory functions */}
                    <div className="flex gap-2 mb-4">
                        <Button
                            onClick={memoryAdd}
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900"
                        >
                            M+
                        </Button>
                        <Button
                            onClick={memorySubtract}
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900"
                        >
                            M-
                        </Button>
                        <Button
                            onClick={memoryRecall}
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900"
                        >
                            MR
                        </Button>
                        <Button
                            onClick={memoryClear}
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900"
                        >
                            MC
                        </Button>
                    </div>

                    {/* Display memory value */}
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Memory: {memory.toFixed(2)}
                    </div>

                    {/* Error message display with animation */}
                    {error && (
                        <div key={error} className='p-3 mb-4 text-red-500 dark:text-red-300 bg-red-50 dark:bg-red-950 rounded-lg
                            border border-red-200 dark:border-red-800 animate-shake'>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Scientific Functions Row 1 */}
                    <div className='grid grid-cols-5 gap-2'>
                        <Button onClick={() => calculateScientific('sin')} variant="outline" size="sm">
                            sin
                        </Button>
                        <Button onClick={() => calculateScientific('cos')} variant="outline" size="sm">
                            cos
                        </Button>
                        <Button onClick={() => calculateScientific('tan')} variant="outline" size="sm">
                            tan
                        </Button>
                        <Button onClick={() => calculateScientific('log')} variant="outline" size="sm">
                            log
                        </Button>
                        <Button onClick={() => calculateScientific('ln')} variant="outline" size="sm">
                            ln
                        </Button>
                    </div>

                    {/* Scientific Functions Row 2 */}
                    <div className='grid grid-cols-5 gap-2'>
                        <Button onClick={() => calculateScientific('asin')} variant="outline" size="sm">
                            sin⁻¹
                        </Button>
                        <Button onClick={() => calculateScientific('acos')} variant="outline" size="sm">
                            cos⁻¹
                        </Button>
                        <Button onClick={() => calculateScientific('atan')} variant="outline" size="sm">
                            tan⁻¹
                        </Button>
                        <Button onClick={() => calculateScientific('sqrt')} variant="outline" size="sm">
                            √
                        </Button>
                        <Button onClick={() => calculateScientific('square')} variant="outline" size="sm">
                            x²
                        </Button>
                    </div>

                    {/* Constants and Special Functions */}
                    <div className='grid grid-cols-5 gap-2'>
                        <Button onClick={() => insertConstant('pi')} variant="outline" size="sm">
                            π
                        </Button>
                        <Button onClick={() => insertConstant('e')} variant="outline" size="sm">
                            e
                        </Button>
                        <Button onClick={() => calculateScientific('factorial')} variant="outline" size="sm">
                            x!
                        </Button>
                        <Button onClick={calculatePercentage} variant="outline" size="sm">
                            %
                        </Button>
                        <Button onClick={() => calculateScientific('abs')} variant="outline" size="sm">
                            |x|
                        </Button>
                    </div>

                    {/* Display and Controls */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {angleMode === 'deg' ? 'DEG' : 'RAD'}
                            </span>
                            <Button
                                onClick={toggleAngleMode}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                            >
                                {angleMode === 'deg' ? 'DEG' : 'RAD'}
                            </Button>
                        </div>

                        <Input
                            value={display}
                            readOnly
                            className="text-right text-2xl font-mono py-4 h-16 rounded-xl bg-gray-50 dark:bg-gray-700"
                        />

                        <div className="text-right text-sm text-gray-500 dark:text-gray-400 font-mono">
                            {expression}
                        </div>
                    </div>

                    {/* Number Pad */}
                    <div className='grid grid-cols-4 gap-2'>
                        <Button onClick={() => inputDigit('7')} variant="outline" size="lg">
                            7
                        </Button>
                        <Button onClick={() => inputDigit('8')} variant="outline" size="lg">
                            8
                        </Button>
                        <Button onClick={() => inputDigit('9')} variant="outline" size="lg">
                            9
                        </Button>
                        <Button onClick={backspace} variant="outline" size="lg" className="bg-red-50 dark:bg-red-950">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>

                        <Button onClick={() => inputDigit('4')} variant="outline" size="lg">
                            4
                        </Button>
                        <Button onClick={() => inputDigit('5')} variant="outline" size="lg">
                            5
                        </Button>
                        <Button onClick={() => inputDigit('6')} variant="outline" size="lg">
                            6
                        </Button>
                        <Button onClick={() => calculateScientific('exp')} variant="outline" size="lg">
                            eˣ
                        </Button>

                        <Button onClick={() => inputDigit('1')} variant="outline" size="lg">
                            1
                        </Button>
                        <Button onClick={() => inputDigit('2')} variant="outline" size="lg">
                            2
                        </Button>
                        <Button onClick={() => inputDigit('3')} variant="outline" size="lg">
                            3
                        </Button>
                        <Button onClick={() => calculateScientific('cube')} variant="outline" size="lg">
                            x³
                        </Button>

                        <Button onClick={() => inputDigit('0')} variant="outline" size="lg">
                            0
                        </Button>
                        <Button onClick={inputDecimal} variant="outline" size="lg">
                            .
                        </Button>
                        <Button onClick={clearEntry} variant="outline" size="lg" className="bg-yellow-50 dark:bg-yellow-950">
                            CE
                        </Button>
                        <Button onClick={clearAll} variant="outline" size="lg" className="bg-red-50 dark:bg-red-950">
                            AC
                        </Button>
                    </div>

                    {/* Basic Operations */}
                    <div className='grid grid-cols-4 gap-2'>
                        <Button onClick={subtract} variant="outline" size="lg" className="text-red-500 border-red-500">
                            -
                        </Button>
                        <Button onClick={add} variant="outline" size="lg" className="text-green-500 border-green-500">
                            +
                        </Button>
                        <Button onClick={multiply} variant="outline" size="lg" className="text-blue-500 border-blue-500">
                            ×
                        </Button>
                        <Button onClick={divide} variant="outline" size="lg" className="text-purple-500 border-purple-500">
                            ÷
                        </Button>
                    </div>

                    {/* Equals and Power Functions */}
                    <div className='grid grid-cols-2 gap-2'>
                        <Button
                            onClick={() => {
                                if (lastResult !== null) {
                                    if (!waitingForSecondOperand) {
                                        setFirstOperand(lastResult.toString());
                                    } else {
                                        setSecondOperand(lastResult.toString());
                                    }
                                    setDisplay(lastResult.toString());
                                }
                            }}
                            variant="outline"
                            className="py-6 rounded-xl text-lg font-bold"
                        >
                            Ans
                        </Button>
                        <Button
                            onClick={performCalculation}
                            className="py-6 rounded-xl text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-500
                                hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-[1.02]
                                shadow-lg"
                        >
                            =
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* History Panel - Floating on the right side */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-64 z-10 hidden lg:block">
                <Card className="p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-center text-gray-800 dark:text-gray-200">
                            History
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-64 overflow-y-auto">
                        {history.length === 0 ? (
                            <p className="text-center text-gray-500 dark:text-gray-400 text-sm italic">No calculations yet</p>
                        ) : (
                            <ul className="space-y-1">
                                {history.map((item, index) => (
                                    <li
                                        key={index}
                                        className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-xs font-mono"
                                    >
                                        {item.num1} {item.operation} {item.num2} = {item.result}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}