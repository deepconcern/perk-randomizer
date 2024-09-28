import { useContext } from "react";

import { PlayerContext } from "../contexts/PlayerContext";

export function usePlayers() {
  return useContext(PlayerContext);
}
