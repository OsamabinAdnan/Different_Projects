'use client'

import React, { ChangeEvent, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import {motion, AnimatePresence} from 'framer-motion';
import confetti from 'canvas-confetti';
import ThemeToggle from './Theme-Toggle';

// Interface defining the structure of BMI calculation results
interface BmiResult {
    bmi : string,      // Calculated BMI value as a string with 2 decimal places
    category: string,  // BMI category (Underweight, Normal Weight, Overweight, Obese)
}

export default function BMICalculator() {
    // State management using React hooks
    const [weight, setWeight] = useState<string>("");     // Store user's weight input
    const [height, setHeight] = useState<string>("")      // Store user's height input
    const [result, setResult] = useState<BmiResult | null> (null)  // Store BMI calculation results
    const [error, setError] = useState<string>("");       // Store error messages

    // Event handlers for input fields
    const handleHeightChange = (e:ChangeEvent<HTMLInputElement>):void => {
        setHeight(e.target.value);
    }

    const handleWeightChange = (e:ChangeEvent<HTMLInputElement>):void => {
        setWeight(e.target.value)
    }

    // Create a celebratory effect using canvas-confetti
    // This function is called when a valid BMI calculation is performed
    const fireConfetti = () => {
        confetti({
            particleCount:500,    // Number of confetti particles
            spread: 100,          // How far the confetti spreads
            origin: {y:0.7},      // Starting position of the confetti (from bottom of screen)
        })
    }

    // Main function to calculate BMI (Body Mass Index)
    // Performs input validation and calculates BMI using the formula: weight / (height^2)
    const calculateBMI = ():void => {
        // Input validation: Check if both height and weight are provided
        if (!height || !weight) {
            setError('Please enter both height and weight');
            return
        } else {
            fireConfetti()
        }

        // Convert height from centimeters to meters and validate
        const heightInMeters = parseFloat(height) / 100;
        if (heightInMeters <=0) {
            setError('Height must be greater than 0');
            return
        }
        else if (isNaN(heightInMeters)) {
            setError('Please enter a valid number for height');
            return;
        }

        // Convert weight to kilograms and validate
        const weightInKg = parseFloat(weight);
        if (weightInKg <=0) {
            setError('Weight must be greater than 0');
            return
        }
        else if (isNaN(weightInKg)) {
            setError('Please enter a valid number for weight');
            return;
        }

        // Calculate BMI using the formula: weight / (height^2)
        const bmiValue = weightInKg / (heightInMeters * heightInMeters);
        let category = " ";

        // Determine BMI category based on calculated value
        if (bmiValue < 18.5) {
            category = 'Underweight';
        }
        else if (bmiValue >= 18.5 && bmiValue <= 24.9){
            category = 'Normal Weight';
        }
        else if (bmiValue >= 25 && bmiValue <= 29.9){
            category = 'Overweight';
        }
        else {
            category = 'Obese';
        }
        
        // Update state with calculated BMI and category
        setResult({
            bmi: bmiValue.toFixed(2),
            category
        })

        // Clear any previous error messages
        setError('');

    }
  return (
    <>
        {/* Main container with full screen height and centered content */}
        <div className='flex justify-center items-center min-h-screen relative'>
            {/* Theme toggle button positioned in top-right corner */}
            <div className='absolute top-4 right-4'>
                <ThemeToggle/>
            </div>
            {/* Animated container for the BMI calculator card */}
            <motion.div
                initial={{opacity:0, scale:0.95}}
                animate={{opacity:1, scale:1}}
                transition={{duration:2}}
                className="w-full px-4 sm:px-0"
            >
                {/* Center the BMI calculator card within the screen */}
                <Card className='w-full max-w-md mx-auto shadow-2xl backdrop-blur-sm bg-white/50 transition-all duration-300 dark:bg-gray-700/50 sm:scale-100 scale-90'>
                    {/* Header with title and description */}
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-xl sm:text-2xl text-center font-bold">BMI Calculator</CardTitle>
                        <CardDescription className='text-black dark:text-white font-normal text-sm sm:text-base text-center'>
                            Enter your height and weight to calculate your BMI
                        </CardDescription>
                    </CardHeader>
                    {/* Card Content */}
                    <CardContent className='space-y-4 p-4 sm:p-6'>
                        {/* Input for height */}
                        <div className='grid gap-2'>
                            <Label htmlFor='height' className="text-sm sm:text-base">Height (cm)</Label>
                            <Input
                                id='height'
                                value={height}
                                type='number'
                                placeholder='Enter your height'
                                onChange={handleHeightChange}
                                className="text-sm sm:text-base"
                            />
                        </div>
                        {/* Input for weight */}
                        <div className='grid gap-2'>
                            <Label htmlFor='weight' className="text-sm sm:text-base">Weight (kg)</Label>
                            <Input
                                id='weight'
                                value={weight}
                                placeholder='Enter your weight'
                                type='number'
                                onChange={handleWeightChange}
                                className="text-sm sm:text-base"
                            />
                        </div>
                        {/* Button to calculate BMI */}
                        <Button onClick={calculateBMI} className="w-full sm:w-auto">Calculate BMI</Button>
                        
                        {/* Display error message if any */}
                        {error && <div className='text-red-500 text-center text-sm sm:text-base'>{error}</div>}

                        <AnimatePresence>
                            {/* Display BMI result if available */}
                            {result && (
                                <motion.div
                                    key='bmi-result'
                                    initial={{opacity:0, y:20}}
                                    animate={{opacity:1, y:0}}
                                    exit={{opacity:0, y:-20}}
                                    transition={{duration:0.5}}
                                    className='grid gap-2'
                                >
                                    <div className='text-center text-xl sm:text-2xl font-bold'>Your BMI is: {result.bmi}</div>
                                    <div className='text-center text-black dark:text-white font-semibold text-sm sm:text-base'>
                                        You are: {result.category}
                                    </div>
                                    
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    </>
  )
}
