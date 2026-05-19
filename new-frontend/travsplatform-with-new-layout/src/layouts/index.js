// src/layouts/index.js
// All available website layouts registered here.
// Add a new layout: create folder in src/layouts/, import here.

import ModernTravelLayout, {
  layoutConfig as modernTravelConfig,
  LayoutPreview as ModernTravelPreview,
} from "./ModernTravel";

import SinglePageStudioLayout, {
  layoutConfig as singlePageStudioConfig,
  LayoutPreview as SinglePageStudioPreview,
} from "./SinglePageStudio";

// Define a function to get layouts to avoid "Cannot access before initialization" errors
// which can happen during circular dependency evaluation.
export function getAllLayouts() {
  return [
    {
      config: modernTravelConfig,
      Layout: ModernTravelLayout,
      Preview: ModernTravelPreview,
    },
    {
      config: singlePageStudioConfig,
      Layout: SinglePageStudioLayout,
      Preview: SinglePageStudioPreview,
    },
  ];
}

export const ALL_LAYOUTS = getAllLayouts();

export function getLayoutById(id) {
  const all = getAllLayouts();
  return all.find((l) => l.config.id === id) || all[0];
}

export default ALL_LAYOUTS;
