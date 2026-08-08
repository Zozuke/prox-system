function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('');
}

/** percent > 0 aclara hacia blanco, percent < 0 oscurece hacia negro */
export function adjustColor(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  if (percent >= 0) {
    return rgbToHex(r + (255 - r) * percent, g + (255 - g) * percent, b + (255 - b) * percent);
  }
  return rgbToHex(r * (1 + percent), g * (1 + percent), b * (1 + percent));
}

export function buildBrandPalette(base: string) {
  return {
    50: adjustColor(base, 0.94),
    100: adjustColor(base, 0.85),
    300: adjustColor(base, 0.45),
    500: base,
    600: adjustColor(base, -0.15),
    700: adjustColor(base, -0.3),
    900: adjustColor(base, -0.6),
  };
}
