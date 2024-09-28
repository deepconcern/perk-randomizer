import { createContext } from "react";

export type Config = {
  isAvoidingOverlapping: boolean;
  randomizingPlayerIds: string[];
};

export const DEFAULT_CONFIG: Config = {
  isAvoidingOverlapping: false,
  randomizingPlayerIds: [],
};

export type ConfigData = Config & {
  addRandomizingPlayerId: (id: string) => void;
  removeRandomizingPlayerId: (id: string) => void;
  toggleAvoidingOverlapping: () => void;
};

export const ConfigContext = createContext<ConfigData>({
  ...DEFAULT_CONFIG,
  addRandomizingPlayerId: () => {},
  removeRandomizingPlayerId: () => {},
  toggleAvoidingOverlapping: () => {},
});
