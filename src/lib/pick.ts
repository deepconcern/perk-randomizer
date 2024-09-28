import { shuffle } from "./shuffle";

export function pick<T>(amount: number, items: T[]): T[] {
  if (amount >= items.length) return [...items];

  return shuffle(items).slice(0, 4);
}
