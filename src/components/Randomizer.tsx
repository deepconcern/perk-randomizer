import { FC, MouseEvent, useCallback, useState } from "react";

import { useConfig } from "../hooks/useConfig";
import { usePlayers } from "../hooks/usePlayers";
import { PERKS } from "../lib/data";
import { pick } from "../lib/pick";

import styles from "./Randomizer.module.css";

type RandomizedPerks = {
  [id: string]: string[];
};

export const Randomizer: FC = () => {
  const { isAvoidingOverlapping, randomizingPlayerIds } = useConfig();

  const { playerMap, players } = usePlayers();

  const [randomizedPerks, setRandomizedPerks] = useState<RandomizedPerks>({});

  const handleRandomize = useCallback(
    (ev: MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();

      const randomizedPerks: RandomizedPerks = {};

      const usedPerks = [];

      for (const randomizingPlayerId of randomizingPlayerIds) {
        const player = playerMap[randomizingPlayerId];

        const availablePerkIds = new Set(player.availablePerkIds);

        // Remove used perks if avoiding overlapping
        if (isAvoidingOverlapping) {
          for (const usedPerkId of usedPerks) {
            availablePerkIds.delete(usedPerkId);
          }
        }

        const pickedPerkIds = pick(4, Array.from(availablePerkIds.values()));

        // Add perks to used perks if avoiding overlapping
        if (isAvoidingOverlapping) {
          for (const pickedPerkId of pickedPerkIds) {
            usedPerks.push(pickedPerkId);
          }
        }

        randomizedPerks[player.id] = pickedPerkIds;
      }

      setRandomizedPerks(randomizedPerks);
    },
    [isAvoidingOverlapping, playerMap, randomizingPlayerIds, setRandomizedPerks]
  );

  return (
    <section>
      <header>
        <h3>Results</h3>
      </header>
      {players.filter((p) => randomizingPlayerIds.includes(p.id))
        .map((player) => {
          const perks = randomizedPerks[player.id];

          return (
            <aside className={styles.result} key={player.id}>
              <h4>{player.name}</h4>
              {!perks?.length ? (
                <p>No perks selected</p>
              ) : (
                <ul>
                  {perks.map((perkId) => {
                    const perk = PERKS.find((p) => p.id === perkId)!;

                    return <li key={perkId}>{perk.name}</li>;
                  })}
                </ul>
              )}
            </aside>
          );
        })}
      <p className={styles.randomize}>
        <button onClick={handleRandomize}>Randomize</button>
      </p>
    </section>
  );
};
