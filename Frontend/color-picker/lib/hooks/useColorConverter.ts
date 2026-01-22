'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getFormattedColor,
  isValidHex,
  findClosestNamedColor,
  getComplementaryColor,
  getAnalogousColors,
  getTriadicColors,
  getRandomColor
} from '../colorUtils';

// Define TypeScript interfaces
export interface ColorState {
  hex: string;
  format: 'hex' | 'rgb' | 'hsl';
  name?: string;
  complementary?: string;
  analogous?: [string, string];
  triadic?: [string, string];
}

export interface ColorHistoryItem {
  hex: string;
  timestamp: number;
}

export interface UseColorConverterResult {
  colorState: ColorState;
  formattedColor: string;
  colorName: string | undefined;
  recentColors: ColorHistoryItem[];
  setHex: (hex: string) => void;
  setFormat: (format: 'hex' | 'rgb' | 'hsl') => void;
  addToHistory: () => void;
  clearHistory: () => void;
  generateRandomColor: () => void;
  getColorHarmony: () => {
    complementary: string;
    analogous: [string, string];
    triadic: [string, string];
  };
}

export function useColorConverter(initialColor: string = '#000000'): UseColorConverterResult {
  // Initialize state
  const [colorState, setColorState] = useState<ColorState>({
    hex: initialColor,
    format: 'hex'
  });

  const [recentColors, setRecentColors] = useState<ColorHistoryItem[]>([]);

  // Load recent colors from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('colorPickerRecentColors');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentColors(parsed);
        }
      } catch (error) {
        console.error('Failed to parse recent colors from localStorage:', error);
      }
    }
  }, []);

  // Save recent colors to localStorage when they change
  useEffect(() => {
    localStorage.setItem('colorPickerRecentColors', JSON.stringify(recentColors));
  }, [recentColors]);

  // Calculate formatted color
  const formattedColor = getFormattedColor(colorState.hex, colorState.format);

  // Calculate color name
  const colorName = findClosestNamedColor(colorState.hex);

  // Add current color to history
  const addToHistory = useCallback(() => {
    // Remove duplicates
    const filtered = recentColors.filter(item => item.hex !== colorState.hex);

    // Add new color to the beginning
    const newHistory = [
      { hex: colorState.hex, timestamp: Date.now() },
      ...filtered
    ];

    // Keep only the last 10 items
    setRecentColors(newHistory.slice(0, 10));
  }, [colorState.hex, recentColors]);

  // Clear history
  const clearHistory = useCallback(() => {
    setRecentColors([]);
    localStorage.removeItem('colorPickerRecentColors');
  }, []);

  // Generate random color
  const generateRandomColor = useCallback(() => {
    const randomHex = getRandomColor();
    setColorState(prev => ({
      ...prev,
      hex: randomHex
    }));
  }, []);

  // Get color harmony
  const getColorHarmony = useCallback(() => {
    return {
      complementary: getComplementaryColor(colorState.hex),
      analogous: getAnalogousColors(colorState.hex),
      triadic: getTriadicColors(colorState.hex)
    };
  }, [colorState.hex]);

  // Set hex color with validation
  const setHex = useCallback((hex: string) => {
    if (isValidHex(hex)) {
      setColorState(prev => ({
        ...prev,
        hex
      }));
    } else {
      console.warn(`Invalid hex color: ${hex}`);
    }
  }, []);

  // Set format
  const setFormat = useCallback((format: 'hex' | 'rgb' | 'hsl') => {
    setColorState(prev => ({
      ...prev,
      format
    }));
  }, []);

  return {
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
  };
}