import type { Tool } from "../../data/types";
import { TOOLS } from "../../data/fixtures";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function fetchTools(): Promise<Tool[]> {
  await sleep(200); // simulate network
  return TOOLS;
}

export async function fetchToolById(id: string): Promise<Tool | undefined> {
  await sleep(150);
  return TOOLS.find((t) => t.id === id);
}
