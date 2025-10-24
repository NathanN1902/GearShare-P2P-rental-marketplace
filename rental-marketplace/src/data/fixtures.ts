// src/data/fixtures.ts
import type { Tool, User } from "./types";

export const TOOLS: Tool[] = Array.from({ length: 24 }).map((_, i) => ({
  id: String(i + 1),
  title: `Tool #${i + 1}`,
  subtitle: "Short description goes here",
  location: ["Sydney, NSW", "Melbourne, VIC", "Brisbane, QLD"][i % 3],
  priceDay: 20 + i * 2,
  badge: i % 5 === 0 ? "Popular" : i % 7 === 0 ? "New" : undefined,
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

