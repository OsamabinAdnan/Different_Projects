'use client' // Indicates that this is a client-side component in Next.js

// Import necessary dependencies and UI components
import React, { ChangeEvent, useState } from 'react' // React core and hooks
import { unitTypes } from './units' // Import unit categories from a local module
import { conversionRates } from './units' // Import unit conversion rates from the same module
import { Label } from './ui/label' // UI label component
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select' // Custom select dropdown components
import { Input } from './ui/input' // Input field component
import { Button } from './ui/button' // Button component
import toast, { Toaster } from 'react-hot-toast' // Toast notifications
import ThemeToggle from './ThemeToggle'

// Main component definition
export default function UnitConverter() {
    // Define state variables to hold input value, selected units, and converted result
    const [inputValue, setInputValue] = useState<number | null>(null);
    const [inputUnit, setInputUnit] = useState<string | null>(null);
    const [outputUnit, setOutputUnit] = useState<string | null>(null);
    const [convertedValue, setConvertedValue] = useState<number | null>(null);
    const [conversionHistory, setConversionHistory] = useState<Array<{
        input: number;
        inputUnit: string;
        output: number;
        outputUnit: string;
        result: number;
    }>>([]);

    // Handle changes in numeric input
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow empty string or valid number
        if (value === '' || !isNaN(parseFloat(value))) {
            setInputValue(value === '' ? null : parseFloat(value));
        }
    }

    // Handle change in selected input unit
    const handleInputUnitChange = (value: string) => {
        setInputUnit(value) // Set input unit from select
    }

    // Handle change in selected output unit
    const handleOutputUnitChange = (value: string): void => {
        setOutputUnit(value) // Set output unit from select
    };

    // Convert input value to output unit based on selected units and category
    const convertValue = (): void => {
        if (inputValue !== null && inputUnit && outputUnit) { // Ensure all inputs are present
            let unitCategory: string | null = null;

            // Determine which category both units belong to
            for (const category in unitTypes) {
                if (
                    unitTypes[category].includes(inputUnit) &&
                    unitTypes[category].includes(outputUnit)
                ) {
                    unitCategory = category;
                    break; // Stop once the category is found
                }
            }

            // If both units are from the same category, perform conversion
            if (unitCategory) {
                let result: number;

                // Special handling for temperature conversions
                if (unitCategory === 'temperature') {
                    result = convertTemperature(inputValue, inputUnit, outputUnit);
                } else {
                    // Standard conversion for other units
                    const baseValue = inputValue * conversionRates[unitCategory][inputUnit]; // Convert to base unit
                    result = baseValue / conversionRates[unitCategory][outputUnit]; // Convert to target unit
                }

                setConvertedValue(result); // Update the result state

                // Save to conversion history
                const newEntry = {
                    input: inputValue,
                    inputUnit: inputUnit,
                    output: result,
                    outputUnit: outputUnit,
                    result: result
                };

                // Add to history (keep only last 5 conversions)
                setConversionHistory(prev => [newEntry, ...prev.slice(0, 4)]);

                toast.success('Conversion successful!', { // Show success toast
                    duration: 3000,
                    position: 'top-center'
                });
            } else {
                // Units are incompatible; show error
                setConvertedValue(null);
                toast.error('Incompatible units types selected', {
                    duration: 3000,
                    position: 'top-center'
                });
            }
        } else {
            // Missing required fields; show error
            setConvertedValue(null);
            toast.error('Please fill all the fields', {
                duration: 3000,
                position: 'top-center'
            });
        }
    };

    // Helper function for temperature conversions
    const convertTemperature = (value: number, fromUnit: string, toUnit: string): number => {
        // First convert to Celsius as base unit
        let celsiusValue: number;

        switch(fromUnit) {
            case 'Celsius (°C)':
                celsiusValue = value;
                break;
            case 'Fahrenheit (°F)':
                celsiusValue = (value - 32) * 5/9;
                break;
            case 'Kelvin (K)':
                celsiusValue = value - 273.15;
                break;
            default:
                celsiusValue = value;
        }

        // Then convert from Celsius to target unit
        switch(toUnit) {
            case 'Celsius (°C)':
                return celsiusValue;
            case 'Fahrenheit (°F)':
                return (celsiusValue * 9/5) + 32;
            case 'Kelvin (K)':
                return celsiusValue + 273.15;
            default:
                return celsiusValue;
        }
    };

    // Function to swap input and output units
    const swapUnits = () => {
        if (inputUnit && outputUnit) {
            const tempUnit = inputUnit;
            setInputUnit(outputUnit);
            setOutputUnit(tempUnit);

            // If we have a converted value, use it as the new input
            if (convertedValue !== null && inputValue !== null) {
                setInputValue(convertedValue);
            }
        }
    };

    // Function to clear conversion history
    const clearHistory = () => {
        setConversionHistory([]);
    };

    // Function to reset the converter
    const resetConverter = () => {
        setInputValue(null);
        setInputUnit(null);
        setOutputUnit(null);
        setConvertedValue(null);
    };

    // JSX to render the component
    return (
        <>
            <Toaster /> {/* Renders toast notifications */}
            <div className='flex flex-col items-center justify-center min-h-screen p-4 '>
                <div className=''>
                    <ThemeToggle/>
                </div>
                {/* Card container */}
                <div className='w-full max-w-md p-4 md:p-6 lg:p-8 bg-card rounded-lg shadow-2xl border border-border transition-all'>
                    {/* Header */}
                    <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold uppercase text-center mb-2'>Unit Converter</h1>
                    <p className='text-sm md:text-base lg:text-lg text-center font-normal text-muted-foreground mb-6'>Convert values between different units</p>
                    
                    {/* Form section */}
                    <div className='flex flex-col gap-6'>
                        {/* Grid for unit selection */}
                        <div className='grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-2 md:gap-4 items-end'>
                            {/* Input unit selector */}
                            <div className='space-y-2'>
                                <Label htmlFor='input-unit' className='text-sm font-medium'>From</Label>
                                <Select onValueChange={handleInputUnitChange}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select unit'/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Render unit categories and options */}
                                        {Object.entries(unitTypes).map(([category, units]) => (
                                            <SelectGroup key={category}>
                                                <SelectLabel className='font-semibold'>
                                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                                </SelectLabel>
                                                {units.map((unit) => (
                                                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Swap button */}
                            <div className='flex justify-center pb-2'>
                                <Button
                                    type='button'
                                    onClick={swapUnits}
                                    variant='outline'
                                    size='icon'
                                    className='rounded-full h-10 w-10'
                                    aria-label='Swap units'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m8 17-4-4 4-4"/>
                                        <path d="m16 7 4 4-4 4"/>
                                        <path d="M3 11h16"/>
                                    </svg>
                                </Button>
                            </div>

                            {/* Output unit selector */}
                            <div className='space-y-2'>
                                <Label htmlFor='output-unit' className='text-sm font-medium'>To</Label>
                                <Select onValueChange={handleOutputUnitChange}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select unit'/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Render unit categories and options */}
                                        {Object.entries(unitTypes).map(([category, units]) => (
                                            <SelectGroup key={category}>
                                                <SelectLabel className='font-semibold'>
                                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                                </SelectLabel>
                                                {units.map((unit) => (
                                                    <SelectItem key={unit} value={unit}>
                                                        {unit}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Input value field */}
                        <div className='space-y-2'>
                            <Label htmlFor='input-value' className='text-sm font-medium'>Value</Label>
                            <Input
                                id='input-value'
                                type='number'
                                placeholder='Enter value'
                                onChange={handleInputChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        convertValue();
                                    }
                                }}
                                className='w-full'
                            />
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                            <Button
                                type='button'
                                onClick={convertValue}
                                className="flex-1 py-2 transition-colors">
                                Convert
                            </Button>
                            <Button
                                type='button'
                                onClick={resetConverter}
                                variant="outline"
                                className="py-2 transition-colors"
                                aria-label="Reset converter">
                                Reset
                            </Button>
                        </div>

                        {/* Display converted result */}
                        <div className="mt-4 text-center p-4 bg-muted rounded-lg">
                            <div className='text-2xl md:text-3xl lg:text-4xl font-bold text-primary'>
                                {convertedValue !== null ? convertedValue.toFixed(2) : '0'} {/* Show result or 0 */}
                            </div>
                            <div className='text-sm md:text-base text-muted-foreground mt-1'>
                                {outputUnit ? outputUnit : 'Unit'} {/* Show unit label or default */}
                            </div>
                        </div>

                        {/* Conversion History */}
                        {conversionHistory.length > 0 && (
                            <div className="mt-6" role="region" aria-labelledby="history-heading">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 id="history-heading" className="text-lg font-semibold">Recent Conversions</h3>
                                    <Button
                                        type="button"
                                        onClick={clearHistory}
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs text-muted-foreground hover:text-destructive"
                                        aria-label="Clear history"
                                    >
                                        Clear
                                    </Button>
                                </div>
                                <div className="space-y-2 max-h-40 overflow-y-auto rounded-md border p-2">
                                    {conversionHistory.map((entry, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-2 bg-secondary rounded text-sm"
                                            role="listitem"
                                        >
                                            <span className="truncate max-w-[70%]">
                                                {entry.input} {entry.inputUnit} = {entry.result.toFixed(2)} {entry.outputUnit}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setInputValue(entry.result);
                                                    setInputUnit(entry.outputUnit);
                                                    setOutputUnit(entry.inputUnit);
                                                }}
                                                className="text-xs px-2 py-1 h-7 flex-shrink-0"
                                                aria-label={`Use ${entry.result.toFixed(2)} ${entry.outputUnit}`}
                                            >
                                                Use
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
