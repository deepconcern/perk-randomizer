import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { v4 as uuid } from "uuid";

export type Player = {
  availableCharacters: string[];
  availablePerks: string[];
  id: string;
  name: string;
};

export type NewPlayer = Omit<Player, "id">;

export type UpdatePlayer = NewPlayer;

export type PlayerData = {
  addPlayer: (newPlayer: NewPlayer) => string;
  playerMap: { [id: string]: Player };
  players: Player[];
  removePlayer: (id: string) => void;
  updatePlayer: (id: string, updatePlayer: UpdatePlayer) => void;
};

const PlayerContext = createContext<PlayerData>({
  addPlayer: () => "default",
  playerMap: {},
  players: [],
  removePlayer: () => {},
  updatePlayer: () => null,
});

export const PlayerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [playerMap, setPlayerMap] = useState<{ [id: string]: Player }>(() => {
    const storedPlayersData = localStorage.getItem("players");

    if (!storedPlayersData) {
      localStorage.setItem("players", JSON.stringify({}));
      
      return {};
    };

    try {
      return JSON.parse(storedPlayersData);
    } catch (e) {
      console.error("Inable to parse stored player:", e);
      return {};
    }
  });

  const addPlayer = useCallback(
    (newPlayer: NewPlayer) => {
      const id = uuid();

      setPlayerMap((playerMap) => {
        const updatedPlayers: { [id: string]: Player } = { ...playerMap };

        updatedPlayers[id] = {
          ...newPlayer,
          id,
        };

        localStorage.setItem("players", JSON.stringify(updatedPlayers));

        return updatedPlayers;
      });

      return id;
    },
    [setPlayerMap]
  );

  const removePlayer = useCallback(
    (id: string) => {
      setPlayerMap((playerMap) => {
        if (!playerMap[id]) return playerMap;

        const updatedPlayers: { [id: string]: Player } = { ...playerMap };

        delete updatedPlayers[id];

        localStorage.setItem("players", JSON.stringify(updatedPlayers));

        return updatedPlayers;
      });
    },
    [setPlayerMap]
  );

  const updatePlayer = useCallback(
    (id: string, updatePlayer: UpdatePlayer) => {
      setPlayerMap((playerMap) => {
        if (!playerMap[id]) return playerMap;

        const updatedPlayers: { [id: string]: Player } = { ...playerMap };

        updatedPlayers[id] = {
          ...updatePlayer,
          id,
        };

        localStorage.setItem("players", JSON.stringify(updatedPlayers));

        return updatedPlayers;
      });
    },
    [setPlayerMap]
  );

  const value = useMemo(
    () => ({
      addPlayer,
      playerMap,
      players: Object.values(playerMap),
      removePlayer,
      updatePlayer,
    }),
    [addPlayer, playerMap, removePlayer, updatePlayer]
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export function usePlayers() {
  return useContext(PlayerContext);
}
