import type { Tool } from "../../data/types";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function loadAllTools(): Promise<Tool[]> {
  // Load tools from JSON file
  const response = await fetch("/data/tools.json");
  const jsonTools: Tool[] = await response.json();

  // Load tools from localStorage
  const storedTools = localStorage.getItem("tools");
  const localTools: Tool[] = storedTools ? JSON.parse(storedTools) : [];

  // Combine both sources
  return [...jsonTools, ...localTools];
}

export async function fetchTools(query?: string): Promise<Tool[]> {
  await sleep(200); // simulate network delay

  const allTools = await loadAllTools();

  if (!query) return allTools;

  const lower = query.toLowerCase();

  return allTools.filter(
    (t) =>
      t.name.toLowerCase().includes(lower) ||
      t.description.toLowerCase().includes(lower) ||
      t.category.toLowerCase().includes(lower)
  );
}

export async function fetchToolById(id: string): Promise<Tool | undefined> {
  await sleep(150);
  const allTools = await loadAllTools();
  return allTools.find((t) => t.id.toString() === id);
}


