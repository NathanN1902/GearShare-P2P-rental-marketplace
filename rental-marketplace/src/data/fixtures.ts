import type { Tool, User } from "./types";

export const TOOLS: Tool[] = Array.from({ length: 24 }).map((_, i) => ({
  id: String(i + 1),
  title: `Tool #${i + 1}`,
  subtitle: "Short description goes here",
  location: ["Sydney, NSW", "Melbourne, VIC", "Brisbane, QLD"][i % 3],
  priceDay: 20 + i * 2,
  badge: i % 5 === 0 ? "Popular" : i % 7 === 0 ? "New" : undefined,
  photos: [ // dummy photos
      { id: "p1", url: "/images/tools/drill-kit-1.jpg", alt: "Drill img 1" },
      { id: "p2", url: "/images/tools/drill-kit-2.jpg", alt: "Drill img 2" },
      { id: "p3", url: "/images/tools/drill-kit-3.jpg", alt: "Drill img 3" },
    ],
  description:
    "This is a placeholder description for the tool. Specs, condition, and pickup details would go here.",
  ownerId: ((i % 3) + 1).toString(),
}));

export const DUMMY_USER: User = {
  id: "1",
  name: "Jane Doe",
  email: "jane@example.com",
  city: "Sydney, NSW",
};

