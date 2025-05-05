export function neonizeHexColor(hex: string) {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Convert RGB to HSL
  const [h, s, l] = rgbToHsl(r, g, b);

  // Boost saturation and brightness
  const neonS = Math.min(1, s * 1.5 + 0.2); // exaggerate saturation
  const neonL = Math.min(1, l * 1.4 + 0.1); // brighten the color

  // Convert back to RGB
  const [nr, ng, nb] = hslToRgb(h, neonS, neonL);

  // Return as hex
  return (
    "#" +
    [nr, ng, nb]
      .map((c) => Math.round(c).toString(16).padStart(2, "0"))
      .join("")
  );
}

// Helpers
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
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
    h = h ? h / 6 : 0;
  }
  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l * 255; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return (p + (q - p) * 6 * t) * 255;
      if (t < 1 / 2) return q * 255;
      if (t < 2 / 3) return (p + (q - p) * (2 / 3 - t) * 6) * 255;
      return p * 255;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [r, g, b];
}
