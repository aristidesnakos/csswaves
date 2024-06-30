export function ensureHexColor(color: string): string {
    // If it's already a hex color, return it
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      return color;
    }
  
    // If it's an oklch color, convert it to a default hex color
    if (color.startsWith('oklch(')) {
      console.warn(`oklch color detected: ${color}. Converting to default color #FF0000`);
      return '#FF0000';
    }
  
    // For other color formats, you might want to add more conversion logic here
  
    // If we can't convert it, return a default color
    console.warn(`Unsupported color format: ${color}. Using default color #FF0000`);
    return '#FF0000';
  }