import { createContext } from "react";

export type Player = {
  availablePerkIds: string[];
  id: string;
  name: string;
};

export type PlayerMap = {
  [id: string]: Player;
};

export type NewPlayer = Omit<Player, "id">;

export type UpdatePlayer = NewPlayer;

export type PlayerData = {
  addPlayer: (newPlayer: NewPlayer) => string;
  playerMap: PlayerMap;
  players: Player[];
  removePlayer: (id: string) => void;
  updatePlayer: (id: string, updatePlayer: UpdatePlayer) => void;
};

export const PlayerContext = createContext<PlayerData>({
  addPlayer: () => "default",
  playerMap: {},
  players: [],
  removePlayer: () => {},
  updatePlayer: () => null,
});
