export function shuffle<T>(items: T[]): T[] {
  const itemIndexes = items.map((_, i) => i);

  const shuffledIndexes = [];

  while (itemIndexes.length > 0) {
    const randomIndex = Math.floor(Math.random() * itemIndexes.length);

    const k = itemIndexes.splice(randomIndex, 1)[0];

    shuffledIndexes.push(k);
  }

  return shuffledIndexes.map((i) => items[i]);
}
