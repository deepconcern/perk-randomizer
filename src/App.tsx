import { ChangeEvent, FC, MouseEvent, useCallback, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

import styles from "./App.module.css";
import DATA from "./data.json";

function shuffle<T>(items: T[]): T[] {
  const itemIndexes = items.map((_, i) => i);

  const shuffledIndexes = [];

  while (itemIndexes.length > 0) {
    const randomIndex = Math.floor(Math.random() * itemIndexes.length);

    const k = itemIndexes.splice(randomIndex, 1)[0];

    shuffledIndexes.push(k);
  }

  return shuffledIndexes.map((i) => items[i]);
}

function pick<T>(amount: number, items: T[]): T[] {
  if (amount >= items.length) return [...items];

  return shuffle(items).slice(0, 4);
}

const SURVIVOR_PERKS = DATA.perks.filter(p => p.type === "survivor");

type Perk = {
  id: string;
  name: string;
};

type Player = {
  availableCharacters: string[],
  availablePerks: string[],
  id: string;
  isRandomizing: boolean;
  name: string;
};

type RandomizedPerks = {
  [id: string]: string[];
};

type EditPlayerDialogProps = {
  player: Player,
};

export const App: FC = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [arePerksPooled, setPerksPooled] = useState(false);
  const [editPlayerState, setEditPlayerState] = useState<string | null>(null);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [randomizedPerks, setRandomizedPerks] = useState<RandomizedPerks>({});

  const handleNewPlayerNameChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      ev.preventDefault();

      setNewPlayerName(ev.target.value);
    },
    [setNewPlayerName]
  );

  const handleNewPlayerSubmit = useCallback(
    (ev: MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();

      const playerId = uuid();

      setNewPlayerName("");
      setPlayers((players) => [
        ...players,
        {
          availableCharacters: [],
          availablePerks: [],
          id: playerId,
          isRandomizing: true,
          name: newPlayerName,
        },
      ]);
    },
    [newPlayerName, setNewPlayerName, setPlayers]
  );

  const handlePlayerDelete = useCallback(
    (id: string) => (ev: MouseEvent<HTMLAnchorElement>) => {
      ev.preventDefault();

      setPlayers((p) => p.filter((p) => p.id !== id));
      setRandomizingPlayers((r) => r.filter((i) => i !== id));
    },
    [setPlayers, setRandomizingPlayers]
  );

  const handlePlayerEdit = useCallback((id: string) => (ev: MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault();

    setEditPlayerState(id);
    dialogRef?.current?.showModal();
  }, [setEditPlayerState]);

  const handlePerksPooledChange = useCallback(
    (_: ChangeEvent<HTMLInputElement>) => {
      setPerksPooled((p) => !p);
    },
    [setPerksPooled]
  );

  const handleRandomize = useCallback(
    (ev: MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();

      const randomizedPerks: RandomizedPerks = {};

      if (arePerksPooled) {
        const selectedPerks = pick(4 * randomizingPlayers.length, SURVIVOR_PERKS).map(
          (perk) => perk.id
        );

        randomizingPlayers.forEach((playerId, i) => {
          const perks = [];

          for (const perkIndex of [0, 1, 2, 3]) {
            perks.push(selectedPerks[perkIndex + 4 * i]);
          }

          randomizedPerks[playerId] = perks;
        });
      } else {
        for (const playerId of randomizingPlayers) {
          randomizedPerks[playerId] = pick(4, SURVIVOR_PERKS).map((perk) => perk.id);
        }
      }

      setRandomizedPerks(randomizedPerks);
    },
    [arePerksPooled, randomizingPlayers, setRandomizedPerks]
  );

  const handleRandomizingPlayerToggle = useCallback(
    (id: string) => (ev: MouseEvent<HTMLAnchorElement>) => {
      ev.preventDefault();

      setRandomizingPlayers((r) => {
        if (r.includes(id)) {
          return r.filter((i) => i !== id);
        }

        return [...r, id];
      });
    },
    [setRandomizingPlayers]
  );

  return (
    <>
      <dialog ref={dialogRef}></dialog>
      <header>
        <h1>DBD Perk Randomizer</h1>
      </header>
      <main>
        <section>
          <form>
            <header>
              <h2>Configure</h2>
            </header>
            <label>Players</label>
            <div className={styles.playerInput}>
              <input
                onChange={handleNewPlayerNameChange}
                placeholder="Add new player..."
                value={newPlayerName}
              />
              <button onClick={handleNewPlayerSubmit}>Create Player</button>
            </div>
            {players.length === 0 ? (
              <p>Add some players</p>
            ) : (
              <ul className={styles.playerArea}>
                {players.map((player) => (
                  <li className={styles.playerInput} key={player.id}>
                    {player.name}
                    <a href="#" onClick={handlePlayerEdit(player.id)}>[Edit]</a>
                    <a
                      href="#"
                      onClick={handleRandomizingPlayerToggle(player.id)}
                    >
                      {randomizingPlayers.includes(player.id)
                        ? "[Exclude]"
                        : "[Include]"}
                    </a>
                    <a href="#" onClick={handlePlayerDelete(player.id)}>
                      [Delete]
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <input
              checked={arePerksPooled}
              id="pool-input"
              name="pool-input"
              onChange={handlePerksPooledChange}
              type="checkbox"
            />
            <label htmlFor="pool-input">Pool talents?</label>
          </form>
        </section>
        <section>
          <header>
            <h3>Results</h3>
          </header>
          {randomizingPlayers.map((playerId) => {
            const player = players.find((p) => p.id === playerId)!;
            const perks = randomizedPerks[playerId];

            return (
              <aside className={styles.result} key={playerId}>
                <h4>{player.name}</h4>
                {!perks?.length ? (
                  <p>No perks selected</p>
                ) : (
                  <ul>
                    {perks.map((perkId) => {
                      const perk = DATA.perks.find((p) => p.id === perkId)!;

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
      </main>
    </>
  );
};
