import React, { lazy } from "react";

// Lazy load layout components
const ModernTravelLayout = lazy(() => import("./ModernTravel"));
const SinglePageStudioLayout = lazy(() => import("./SinglePageStudio"));

// Note: Previews are usually small or used in admin, but we can lazy load them too if needed.
// For now, let's keep them as is or lazy load if they are heavy.
import {
  layoutConfig as modernTravelConfig,
  LayoutPreview as ModernTravelPreview,
} from "./ModernTravel";

import {
  layoutConfig as singlePageStudioConfig,
  LayoutPreview as SinglePageStudioPreview,
} from "./SinglePageStudio";

// Define a function to get layouts to avoid "Cannot access before initialization" errors
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
