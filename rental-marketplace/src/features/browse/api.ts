import type { Tool } from "../../data/types";
import { TOOLS } from "../../data/fixtures";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function fetchTools(query?: string): Promise<Tool[]> {
  await sleep(200); // simulate network delay

  if (!query) return TOOLS;

  const lower = query.toLowerCase();

  return TOOLS.filter(
    (t) =>
      t.title.toLowerCase().includes(lower) ||
      t.subtitle.toLowerCase().includes(lower) ||
      t.location.toLowerCase().includes(lower)
  );
}

export async function fetchToolById(id: string): Promise<Tool | undefined> {
  await sleep(150);
  return TOOLS.find((t) => t.id === id);
}


