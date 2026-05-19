// src/themes/index.js
// Yahan sab themes register hoti hain
// Jab naya theme banao toh yahan add karo

import classicBlueTheme from "./classic-blue/theme";
import playfairLightTheme from "./playfair-light/theme";

export const ALL_THEMES = [
  {
    ...classicBlueTheme,
    // Thumbnail placeholder — ek solid color card dikhega
    thumbnailColor: "#2563eb",
  },
  {
    ...playfairLightTheme,
    // Clean white/blue thumbnail — Index.tsx project wala look
    thumbnailColor: "#f8fafc",
  },
  // Future themes yahan add honge:
  // import sunsetTheme from "./sunset/theme";
  // { ...sunsetTheme, thumbnailColor: "#E8960C" },
];

export default ALL_THEMES;
