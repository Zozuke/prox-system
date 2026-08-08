export const AVAILABLE_FONTS = [
  { name: 'Inter', stack: "'Inter', system-ui, sans-serif" },
  { name: 'Poppins', stack: "'Poppins', system-ui, sans-serif" },
  { name: 'Roboto', stack: "'Roboto', system-ui, sans-serif" },
  { name: 'Merriweather', stack: "'Merriweather', Georgia, serif" },
  { name: 'Montserrat', stack: "'Montserrat', system-ui, sans-serif" },
  { name: 'Nunito', stack: "'Nunito', system-ui, sans-serif" },
];

export function fontStackFor(name: string) {
  return AVAILABLE_FONTS.find((f) => f.name === name)?.stack || AVAILABLE_FONTS[0].stack;
}
