"use client"; // Enables client-side rendering for this component, necessary for interactive features

// Import React hooks for state management and event handling
import { useState, ChangeEvent } from "react";

// Import UI components from the custom component library
// These components provide the styled building blocks for the interface
import {Card} from "@/components/ui/card";                // Container component with styling
import { Label } from "@/components/ui/label";           // Accessible form labels
import { Input } from "@/components/ui/input";           // Styled input fields
import { Checkbox } from "@/components/ui/checkbox";      // Toggle switches for password options
import { CheckedState } from "@radix-ui/react-checkbox"; // Type for checkbox state
import { Button } from "@/components/ui/button";         // Interactive buttons
import { ToastContainer, toast } from 'react-toastify';  // For showing notification messages

/**
 * Password Generator Component
 * Provides an interface for generating secure passwords with customizable options
 * Features include:
 * - Adjustable password length
 * - Character type toggles (uppercase, lowercase, numbers, symbols)
 * - Copy to clipboard functionality
 * - Real-time feedback via toast notifications
 */
export default function GeneratePassword() {
  // Initialize state variables with default values
  // Each state variable controls a different aspect of password generation
  const [length, setLength] = useState<number>(16);                    // Controls password length
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);  // Toggle for uppercase letters
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);  // Toggle for lowercase letters
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);      // Toggle for numbers
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);     // Toggle for special symbols
  const [password, setPassword] = useState<string>("");                     // Stores the generated password


  /**
   * Handles changes to the password length input
   * Converts the string value from the input element to a number
   * @param e - Input change event containing the new value
   */
  const handleLengthChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setLength(Number(e.target.value));
  };

  /**
   * Generates a password based on selected options
   * Combines character sets based on user preferences and
   * randomly selects characters to create the password
   */
  const generatePassword = (): void => {
    // Define character sets for each type of character
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+[]{}|;:,.<>?";

    // Build the character set based on selected options
    let allChars = "";
    if (includeUppercase) allChars += uppercaseChars;
    if (includeLowercase) allChars += lowercaseChars;
    if (includeNumbers) allChars += numberChars;
    if (includeSymbols) allChars += symbolChars;

    // Validate that at least one character type is selected
    if (allChars === "") {
        toast.warn("Please select at least one character type.");
        return;
    }

    // Generate the password by randomly selecting characters
    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      generatedPassword += allChars[randomIndex];
    }
    setPassword(generatedPassword);
  };

  /**
   * Copies the generated password to the clipboard
   * Shows success or error notifications based on the operation result
   */
  const copyToClipboard = (): void => {
    // Validate that a password exists to copy
    if (!password || password.trim() === "") {
      toast.warn("Please generate a password first!");
      return;
    }

    // Attempt to copy to clipboard using the Clipboard API
    navigator.clipboard.writeText(password)
      .then(() => {
        toast.success("Password copied to clipboard!");
      })
      .catch((error: Error) => {
        toast.error(`Failed to copy password: ${error.message}`);
        console.error("Clipboard error:", error);
      });
  };

  /**
   * Higher-order function that handles checkbox state changes
   * Returns a function that updates the appropriate state variable
   * @param setter - State setter function for the relevant option
   * @returns Function that handles the checkbox change event
   */
  const handleCheckboxChange =
    (setter: (value: boolean) => void) =>
    (checked: CheckedState): void => {
      if (typeof checked === "boolean") {
        setter(checked);
      }
    };

  // Render the password generator interface
  return (
    <>
    {/* Toast container for notifications */}
    <ToastContainer position="top-center" autoClose={3000} />
        {/* Main container with center alignment */}
        <div className="flex flex-col items-center justify-center min-h-screen">
            {/* Card component with glassmorphism effect */}
            <Card className="w-full max-w-md p-6 backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-900/70 dark:to-gray-900/50 border border-white/20 dark:border-gray-700/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] dark:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-xl hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.47)] dark:hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.47)] transition-all duration-300 ring-1 ring-white/10 dark:ring-gray-800/50">
                <div className="mx-auto max-w-md space-y-6">
                {/* Title and description section */}
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Password Generator</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                    Create a secure password with just a few clicks.
                    </p>
                </div>
                {/* Options and controls section */}
                <div className="space-y-4">
                    {/* Password length input */}
                    <div className="space-y-2">
                    <Label htmlFor="length">Password Length</Label>
                    <Input
                        id="length"
                        type="number"
                        min="8"
                        max="32"
                        value={length}
                        onChange={handleLengthChange}
                        className="w-full"
                    />
                    </div>
                    {/* Character type options */}
                    <div className="space-y-2">
                    <Label>Include:</Label>
                    {/* Uppercase letters checkbox */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                        id="uppercase"
                        checked={includeUppercase}
                        onCheckedChange={handleCheckboxChange(setIncludeUppercase)}
                        />
                        <Label htmlFor="uppercase">Uppercase Letters</Label>
                    </div>
                    {/* Lowercase letters checkbox */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                        id="lowercase"
                        checked={includeLowercase}
                        onCheckedChange={handleCheckboxChange(setIncludeLowercase)}
                        />
                        <Label htmlFor="lowercase">Lowercase Letters</Label>
                    </div>
                    {/* Numbers checkbox */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                        id="numbers"
                        checked={includeNumbers}
                        onCheckedChange={handleCheckboxChange(setIncludeNumbers)}
                        />
                        <Label htmlFor="numbers">Numbers</Label>
                    </div>
                    {/* Symbols checkbox */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                        id="symbols"
                        checked={includeSymbols}
                        onCheckedChange={handleCheckboxChange(setIncludeSymbols)}
                        />
                        <Label htmlFor="symbols">Symbols</Label>
                    </div>
                    </div>
                    {/* Generate password button */}
                    <Button type="button" className="w-full" onClick={generatePassword}>
                    Generate Password
                    </Button>
                    {/* Password output section */}
                    <div className="space-y-2">
                    <Label htmlFor="password">Generated Password</Label>
                    <div className="flex md:flex-row flex-col items-center md:space-x-2 gap-2 ">
                        <Input
                        id="password"
                        type="text"
                        value={password}
                        readOnly
                        className="flex-1"
                        />
                        <Button type="button" onClick={copyToClipboard}>
                        Copy to Clipboard
                        </Button>
                    </div>
                    </div>
                </div>
                </div>
            </Card>
        </div>
    </>
  );
}