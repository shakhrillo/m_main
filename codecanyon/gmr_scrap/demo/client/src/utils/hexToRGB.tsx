export const hexToRgba = (hex: string, alpha = 1) => {
  if (!hex) return "rgba(0, 0, 0, 0)";

  // Remove the '#' if present
  hex = hex.replace(/^#/, "");

  // Convert 3-digit hex to 6-digit
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Parse the r, g, b values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Return the rgba string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Example usage
console.log(hexToRgba("#3498db", 0.5)); // Output: rgba(52, 152, 219, 0.5)
