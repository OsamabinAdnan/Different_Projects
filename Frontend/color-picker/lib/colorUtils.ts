/**
 * Utility functions for color conversion and manipulation
 */

// Define TypeScript interfaces
export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export interface ColorFormatObject {
  hex: string;
  rgb: string;
  hsl: string;
  name?: string;
}

/**
 * Validates if a string is a valid hex color
 */
export function isValidHex(hex: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(hex);
}

/**
 * Converts a hex color to RGB values
 */
export function hexToRgb(hex: string): RgbColor | null {
  // Remove the hash if present
  const cleanHex = hex.replace('#', '');

  // Handle shorthand hex (e.g., #fff)
  let fullHex = cleanHex;
  if (cleanHex.length === 3) {
    fullHex = cleanHex.split('').map(char => char + char).join('');
  }

  // Validate length
  if (fullHex.length !== 6) {
    return null;
  }

  // Parse the hex values
  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  // Validate parsed values
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null;
  }

  return { r, g, b };
}

/**
 * Converts RGB values to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  // Clamp values to 0-255 range
  const clampedR = Math.max(0, Math.min(255, Math.round(r)));
  const clampedG = Math.max(0, Math.min(255, Math.round(g)));
  const clampedB = Math.max(0, Math.min(255, Math.round(b)));

  // Convert to hex
  const hexR = clampedR.toString(16).padStart(2, '0');
  const hexG = clampedG.toString(16).padStart(2, '0');
  const hexB = clampedB.toString(16).padStart(2, '0');

  return `#${hexR}${hexG}${hexB}`;
}

/**
 * Converts a hex color to HSL values
 */
export function hexToHsl(hex: string): HslColor | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  // Normalize RGB values to 0-1 range
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  // Find maximum and minimum RGB values
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    // Achromatic case (gray)
    h = s = 0;
  } else {
    // Calculate saturation and hue
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    // Calculate hue based on which RGB component is maximum
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    // Convert hue to degrees
    h *= 60;
  }

  // Round values to reasonable precision
  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Converts HSL values to hex color
 */
export function hslToHex(h: number, s: number, l: number): string {
  // Clamp HSL values to valid ranges
  const clampedH = Math.max(0, Math.min(360, h));
  const clampedS = Math.max(0, Math.min(100, s));
  const clampedL = Math.max(0, Math.min(100, l));

  // Convert to 0-1 range for calculations
  const hDecimal = clampedH / 360;
  const sDecimal = clampedS / 100;
  const lDecimal = clampedL / 100;

  // Helper function for HSL to RGB conversion
  function hue2rgb(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }

  let r, g, b;

  if (sDecimal === 0) {
    r = g = b = lDecimal; // achromatic
  } else {
    const q = lDecimal < 0.5 ? lDecimal * (1 + sDecimal) : lDecimal + sDecimal - lDecimal * sDecimal;
    const p = 2 * lDecimal - q;
    r = hue2rgb(p, q, hDecimal + 1/3);
    g = hue2rgb(p, q, hDecimal);
    b = hue2rgb(p, q, hDecimal - 1/3);
  }

  // Convert back to 0-255 range and to hex
  const red = Math.round(r * 255);
  const green = Math.round(g * 255);
  const blue = Math.round(b * 255);

  return rgbToHex(red, green, blue);
}

/**
 * Converts RGB values to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): HslColor {
  // Clamp RGB values to 0-255 range
  const clampedR = Math.max(0, Math.min(255, r)) / 255;
  const clampedG = Math.max(0, Math.min(255, g)) / 255;
  const clampedB = Math.max(0, Math.min(255, b)) / 255;

  const max = Math.max(clampedR, clampedG, clampedB);
  const min = Math.min(clampedR, clampedG, clampedB);

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case clampedR:
        h = (clampedG - clampedB) / d + (clampedG < clampedB ? 6 : 0);
        break;
      case clampedG:
        h = (clampedB - clampedR) / d + 2;
        break;
      case clampedB:
        h = (clampedR - clampedG) / d + 4;
        break;
    }

    h *= 60;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Converts HSL values to RGB
 */
export function hslToRgb(h: number, s: number, l: number): RgbColor {
  // Clamp HSL values to valid ranges
  const clampedH = Math.max(0, Math.min(360, h));
  const clampedS = Math.max(0, Math.min(100, s));
  const clampedL = Math.max(0, Math.min(100, l));

  // Convert to 0-1 range for calculations
  const hDecimal = clampedH / 360;
  const sDecimal = clampedS / 100;
  const lDecimal = clampedL / 100;

  // Helper function for HSL to RGB conversion
  function hue2rgb(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }

  let r, g, b;

  if (sDecimal === 0) {
    r = g = b = lDecimal; // achromatic
  } else {
    const q = lDecimal < 0.5 ? lDecimal * (1 + sDecimal) : lDecimal + sDecimal - lDecimal * sDecimal;
    const p = 2 * lDecimal - q;
    r = hue2rgb(p, q, hDecimal + 1/3);
    g = hue2rgb(p, q, hDecimal);
    b = hue2rgb(p, q, hDecimal - 1/3);
  }

  // Convert back to 0-255 range
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Gets formatted color string in the specified format
 */
export function getFormattedColor(color: string, format: 'hex' | 'rgb' | 'hsl'): string {
  switch (format) {
    case 'hex':
      return color;
    case 'rgb': {
      const rgb = hexToRgb(color);
      if (!rgb) return color; // Return original if invalid
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }
    case 'hsl': {
      const hsl = hexToHsl(color);
      if (!hsl) return color; // Return original if invalid
      return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
    default:
      return color;
  }
}

/**
 * Finds the closest named color from the color-name-list package
 * This function is temporarily disabled due to build issues with dynamic imports.
 * The color naming functionality will be implemented differently.
 */
export function findClosestNamedColor(_hex: string): string | null {
  // Temporarily return null to avoid build issues
  // This function is kept for future implementation
  return null;
}

/**
 * Generates complementary color
 */
export function getComplementaryColor(hex: string): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex; // Return original if invalid

  // Add 180 degrees to hue for complementary color
  const complementaryHue = (hsl.h + 180) % 360;
  return hslToHex(complementaryHue, hsl.s, hsl.l);
}

/**
 * Generates analogous colors (adjacent on color wheel)
 */
export function getAnalogousColors(hex: string, angle: number = 30): [string, string] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [hex, hex]; // Return original if invalid

  const leftHue = (hsl.h - angle + 360) % 360;
  const rightHue = (hsl.h + angle) % 360;

  return [hslToHex(leftHue, hsl.s, hsl.l), hslToHex(rightHue, hsl.s, hsl.l)];
}

/**
 * Generates triadic colors (evenly spaced on color wheel)
 */
export function getTriadicColors(hex: string): [string, string] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [hex, hex]; // Return original if invalid

  const hue1 = (hsl.h + 120) % 360;
  const hue2 = (hsl.h + 240) % 360;

  return [hslToHex(hue1, hsl.s, hsl.l), hslToHex(hue2, hsl.s, hsl.l)];
}

/**
 * Generates a random hex color
 */
export function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}