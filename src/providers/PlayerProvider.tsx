import { FC, PropsWithChildren, useCallback, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";

import {
  NewPlayer,
  PlayerContext,
  PlayerMap,
  UpdatePlayer,
} from "../contexts/PlayerContext";

export const PlayerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [playerMap, setPlayerMap] = useState<PlayerMap>(() => {
    const storedPlayersData = localStorage.getItem("players");

    if (!storedPlayersData) {
      localStorage.setItem("players", JSON.stringify({}));

      return {};
    }

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
        const updatedPlayers: PlayerMap = { ...playerMap };

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

        const updatedPlayers: PlayerMap = { ...playerMap };

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

        const updatedPlayers: PlayerMap = { ...playerMap };

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
