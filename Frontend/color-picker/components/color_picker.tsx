'use client'

import React, { ChangeEvent, useEffect, useState } from 'react';
import { Card, CardDescription, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import ThemeToggle from './Theme_Toggle';
import toast, { Toaster } from 'react-hot-toast';
import { useColorConverter } from '@/lib/hooks/useColorConverter';
import { findClosestNamedColor } from '@/lib/colorUtils';

export default function ColorPicker() {
  const {
    colorState,
    formattedColor,
    colorName,
    recentColors,
    setHex,
    setFormat,
    addToHistory,
    clearHistory,
    generateRandomColor,
    getColorHarmony
  } = useColorConverter();

  // Handle color input changes from the color picker
  const handleColorChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newColor = event.target.value;
    setHex(newColor);
  };

  // Function to copy the current color value to clipboard
  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(formattedColor)
      .then(() => {
        // Add to history after successful copy
        addToHistory();

        // Show success toast with custom styling
        toast.success(`Copied ${formattedColor} to clipboard!`, {
          duration: 2000,
          style: {
            border: '1px solid #e5e7eb',
            padding: '16px',
            background: 'white',
            color: 'black',
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#ecfdf5',
          },
        });
      })
      .catch(() => {
        // Show error toast if clipboard copy fails
        toast.error('Failed to copy to clipboard');
      });
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + H: Hex format
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setFormat('hex');
      }
      // Ctrl/Cmd + R: RGB format
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setFormat('rgb');
      }
      // Ctrl/Cmd + S: HSL format (S for Saturation)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setFormat('hsl');
      }
      // Ctrl/Cmd + G: Generate random color
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        generateRandomColor();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setFormat, generateRandomColor]);

  // Get color harmony values
  const { complementary, analogous, triadic } = getColorHarmony();

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden">
      {/* Background gradient effect */}
      <div
        className="absolute inset-0 w-full transition-colors duration-500"
        style={{
          background: `linear-gradient(45deg, ${colorState.hex}aa, transparent)`,
          zIndex: -1
        }}
        aria-hidden="true"
      />

      {/* Toast notification container */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: '8px',
            padding: '12px',
          },
        }}
      />

      {/* Theme toggle button container */}
      <div className="flex justify-end w-full p-4">
        <ThemeToggle />
      </div>

      {/* Main content container */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4">
        {/* Main color picker card */}
        <Card
          role="region"
          aria-labelledby="color-picker-title"
          className="w-full max-w-md sm:max-w-lg mx-auto p-4 sm:p-6 rounded-xl sm:rounded-2xl backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-white/20 dark:border-gray-700/50 transition-all duration-500 shadow-2xl shadow-black/10 dark:shadow-black/20 hover:shadow-3xl max-h-[calc(100vh-140px)] overflow-y-auto"
        >
        {/* Card header */}
        <div className="text-center space-y-1 mb-3" id="color-picker-title">
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Color Picker
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Select and copy color values in different formats
          </CardDescription>
        </div>

        {/* Color display and controls */}
        <div className="space-y-4">
          {/* Color preview box */}
          <div
            className="relative w-full aspect-video rounded-xl sm:rounded-2xl border-4 border-white/30 dark:border-gray-600/50 transition-all duration-300 shadow-inner hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 overflow-hidden group"
            style={{ backgroundColor: colorState.hex }}
            tabIndex={0}
            aria-label={`Selected color preview: ${colorState.hex}`}
          >
            {/* Subtle overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          {/* Color value display and format toggles */}
          <div className="flex flex-col gap-3 items-center">
            <div
              className="font-mono font-bold text-xl sm:text-2xl break-all text-center px-3 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-white/50 dark:bg-black/30 backdrop-blur-sm shadow-inner min-w-[150px] sm:min-w-[180px]"
              aria-live="polite"
              aria-atomic="true"
            >
              {formattedColor}
            </div>

            {/* Color name if available */}
            {colorName && (
              <div className="text-base sm:text-lg font-medium capitalize bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {colorName}
              </div>
            )}

            {/* Format toggle buttons */}
            <div className="flex gap-1 bg-white/30 dark:bg-black/20 p-1 rounded-lg sm:rounded-xl">
              {(['hex', 'rgb', 'hsl'] as const).map((f) => (
                <Button
                  key={f}
                  variant={colorState.format === f ? 'default' : 'ghost'}
                  onClick={() => setFormat(f)}
                  className={`rounded-md sm:rounded-lg px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium transition-all ${
                    colorState.format === f
                      ? 'bg-white text-primary shadow-md'
                      : 'hover:bg-white/50 dark:hover:bg-white/10'
                  }`}
                  aria-pressed={colorState.format === f}
                  aria-label={`Switch to ${f.toUpperCase()} format (${f === 'hex' ? 'Ctrl+H' : f === 'rgb' ? 'Ctrl+R' : 'Ctrl+S'})`}
                >
                  {f.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <Button
              variant="default"
              onClick={copyToClipboard}
              className="w-full py-4 sm:py-6 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              aria-label="Copy current color value to clipboard"
            >
              Copy
            </Button>
            <Button
              variant="outline"
              onClick={generateRandomColor}
              className="w-full py-4 sm:py-6 text-base sm:text-lg font-semibold border-2 border-primary/50 bg-white/30 dark:bg-black/20 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:-translate-y-0.5"
              aria-label="Generate random color (Ctrl+G)"
            >
              Random
            </Button>
          </div>

          {/* Recent colors */}
          {recentColors.length > 0 && (
            <div className="pt-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm sm:text-base font-semibold text-foreground">Recent</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="h-6 p-1 text-xs font-medium hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                  aria-label="Clear recent colors history"
                >
                  Clear
                </Button>
              </div>
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {recentColors.map((item, index) => (
                  <button
                    key={index}
                    className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border-2 border-white/50 shadow-md hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group relative overflow-hidden"
                    style={{ backgroundColor: item.hex }}
                    onClick={() => setHex(item.hex)}
                    aria-label={`Select recent color ${item.hex}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color harmony */}
          <div className="pt-3">
            <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2 text-center">Harmony</h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <span className="text-xs sm:text-sm font-medium bg-white/50 dark:bg-black/30 px-2 py-1 rounded-full">Comp</span>
                <button
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl border-2 border-white/50 shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group relative overflow-hidden"
                  style={{ backgroundColor: complementary }}
                  onClick={() => setHex(complementary)}
                  aria-label={`Select complementary color ${complementary}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <span className="text-xs sm:text-sm font-medium bg-white/50 dark:bg-black/30 px-2 py-1 rounded-full">Anal</span>
                <div className="flex gap-1 sm:gap-2">
                  <button
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border-2 border-white/50 shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group relative overflow-hidden"
                    style={{ backgroundColor: analogous[0] }}
                    onClick={() => setHex(analogous[0])}
                    aria-label={`Select first analogous color ${analogous[0]}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                  <button
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border-2 border-white/50 shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group relative overflow-hidden"
                    style={{ backgroundColor: analogous[1] }}
                    onClick={() => setHex(analogous[1])}
                    aria-label={`Select second analogous color ${analogous[1]}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <span className="text-xs sm:text-sm font-medium bg-white/50 dark:bg-black/30 px-2 py-1 rounded-full">Tria</span>
                <div className="flex gap-1 sm:gap-2">
                  <button
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border-2 border-white/50 shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group relative overflow-hidden"
                    style={{ backgroundColor: triadic[0] }}
                    onClick={() => setHex(triadic[0])}
                    aria-label={`Select first triadic color ${triadic[0]}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                  <button
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border-2 border-white/50 shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group relative overflow-hidden"
                    style={{ backgroundColor: triadic[1] }}
                    onClick={() => setHex(triadic[1])}
                    aria-label={`Select second triadic color ${triadic[1]}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Color picker input */}
          <div className="pt-3">
            <h3 className="text-center text-lg font-semibold mb-2 text-foreground">Pick</h3>
            <div className="relative">
              <Input
                type="color"
                value={colorState.hex}
                onChange={handleColorChange}
                className="w-full h-12 sm:h-14 cursor-pointer rounded-lg sm:rounded-xl border-2 border-white/30 bg-white/20 backdrop-blur-sm shadow-inner"
                aria-label="Color picker input"
              />
              <div className="absolute inset-0 rounded-lg sm:rounded-xl pointer-events-none border-2 border-white/20 dark:border-gray-600/30 mix-blend-overlay"></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
  );
}
