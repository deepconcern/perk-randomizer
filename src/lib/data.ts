import DATA from "./data.json";

export const CHARACTERS = DATA.characters;
CHARACTERS.sort();

export const PERKS = DATA.perks;
PERKS.sort();

export const CHARACTER_PERKS_MAP = PERKS.reduce<{ [id: string]: string[] }>(
  (map, perk) => {
    if (!perk.characterId) {
      return map;
    }

    if (!map[perk.characterId]) {
      map[perk.characterId] = [];
    }

    map[perk.characterId].push(perk.id);

    return map;
  },
  {}
);

export const SURVIVOR_CHARACTERS = CHARACTERS.filter((c) => c.type === "survivor");

export const SURVIVOR_PERKS = PERKS.filter((p) => p.type === "survivor");