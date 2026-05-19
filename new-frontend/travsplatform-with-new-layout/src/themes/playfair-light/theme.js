// Theme: Playfair Light
// Index.tsx wale project ka theme — elegant serif fonts,
// light background, muted primary color with Playfair Display headings

const playfairLightTheme = {
  id: "playfair-light",
  name: "Playfair Light",
  description: "Elegant serif theme with light, airy design",
  thumbnail: null, // Add image URL here later
  colors: {
    primary: "#1a56db",       // text-primary from shadcn/ui default
    secondary: "#1e429f",
    accent: "#a4cafe",
    background: "#ffffff",    // bg-background — clean white
    text: "#111827",          // foreground
  },
  fonts: {
    heading: "'Playfair Display', serif",  // Index.tsx me yahi use hua hai
    body: "Inter",
  },
  // Future: layout overrides, component styles, etc.
};

export default playfairLightTheme;
