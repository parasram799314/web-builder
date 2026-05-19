// src/data/emailTemplates.js

export const EMAIL_CATEGORIES = [
  { id: "booking", label: "Booking Confirmations", icon: "✅" },
  { id: "itinerary", label: "Trip Itinerary", icon: "🗺️" },
  { id: "promotional", label: "Promotional", icon: "📣" },
  { id: "other", label: "Other", icon: "✨" },
];

export const EMAIL_TEMPLATES = [
  {
    id: "confirm-1",
    category: "booking",
    name: "Wanderly Confirmation",
    description: "Premium booking summary with flight and stay details.",
    thumbnail: "🎫",
    color: "#fb7185",
    componentPath: "confirmations/first"
  },
  {
    id: "confirm-2",
    category: "booking",
    name: "Classic Confirmation",
    description: "Clean, professional booking summary for hotels and flights.",
    thumbnail: "📄",
    color: "#4F46E5"
  },
  {
    id: "confirm-3",
    category: "booking",
    name: "Modern Receipt",
    description: "Detailed breakdown with interactive maps and support links.",
    thumbnail: "🧾",
    color: "#10B981"
  },
  {
    id: "itin-1",
    category: "itinerary",
    name: "Day-wise Adventure",
    description: "Perfect for 5-10 day group tours with daily activity cards.",
    thumbnail: "🎒",
    color: "#F59E0B"
  },
  {
    id: "itin-2",
    category: "itinerary",
    name: "Luxury Escape",
    description: "Visual-heavy itinerary focused on high-quality resort images.",
    thumbnail: "🏝️",
    color: "#EC4899"
  },
  {
    id: "promo-1",
    category: "promotional",
    name: "Wanderlust Luxury",
    description: "Premium promotional layout with featured destinations and hero banner.",
    thumbnail: "✈️",
    color: "#0f2a3d",
    componentPath: "promotions/one"
  },
  {
    id: "promo-2",
    category: "promotional",
    name: "Azure Trails",
    description: "Modern high-contrast layout with gradient buttons and card designs.",
    thumbnail: "🏔️",
    color: "#FF6B6B",
    componentPath: "promotions/second"
  },
  {
    id: "promo-3",
    category: "promotional",
    name: "Early Bird Offer",
    description: "Urgency-focused layout for seasonal discounts.",
    thumbnail: "⏰",
    color: "#EF4444"
  },
  {
    id: "promo-4",
    category: "promotional",
    name: "Newsletter Digest",
    description: "Curated travel stories and top-rated destinations.",
    thumbnail: "📰",
    color: "#6366F1"
  },
  {
    id: "other-1",
    category: "other",
    name: "Feedback Request",
    description: "Simple post-trip survey to gather client testimonials.",
    thumbnail: "⭐",
    color: "#8B5CF6"
  },
  {
    id: "other-2",
    category: "other",
    name: "Welcome Back",
    description: "Personalized message for returning customers.",
    thumbnail: "👋",
    color: "#14B8A6"
  }
];
