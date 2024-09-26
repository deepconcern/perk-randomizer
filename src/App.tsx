import {
  ChangeEvent,
  FC,
  FormEvent,
  Fragment,
  MouseEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { v4 as uuid } from "uuid";

import styles from "./App.module.css";
import DATA from "./data.json";

const CHARACTERS = DATA.characters;
CHARACTERS.sort();

const PERKS = DATA.perks;
PERKS.sort();

const CHARACTER_PERKS_MAP = PERKS.reduce<{ [id: string]: string[] }>(
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

const SURVIVOR_CHARACTERS = CHARACTERS.filter((c) => c.type === "survivor");

const SURVIVOR_PERKS = PERKS.filter((p) => p.type === "survivor");

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

type Player = {
  availableCharacters: string[];
  availablePerks: string[];
  id: string;
  isRandomizing: boolean;
  name: string;
};

type RandomizedPerks = {
  [id: string]: string[];
};

type EditPlayerDialogProps = {
  onClose: () => void;
  onSubmit: (newPlayer: Player) => void;
  player: Player;
};

const EditPlayerDialog: FC<EditPlayerDialogProps> = ({
  onClose,
  onSubmit,
  player,
}) => {
  const [availableCharacters, setAvailableCharacters] = useState(
    player.availableCharacters
  );
  const [availablePerks, setAvailablePerks] = useState(player.availablePerks);
  const [name, setName] = useState(player.name);

  const handleCancel = useCallback(
    (ev: MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      onClose();
    },
    [onClose]
  );

  const handleCharacterSelect = useCallback(
    (id: string) => (_: ChangeEvent<HTMLInputElement>) => {
      setAvailableCharacters((a) => {
        if (a.includes(id)) {
          return a.filter((c) => c !== id);
        }

        return [...a, id];
      });
    },
    [setAvailableCharacters]
  );

  const handleCharacterSelectAll = useCallback(
    (_: ChangeEvent<HTMLInputElement>) => {
      setAvailableCharacters((a) => {
        if (a.length === SURVIVOR_CHARACTERS.length) return [];

        return SURVIVOR_CHARACTERS.map((c) => c.id);
      });
    },
    [setAvailableCharacters]
  );

  const handleNameChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      setName(ev.target.value);
    },
    [setName]
  );

  const handlePerkSelect = useCallback(
    (id: string) => (_: ChangeEvent<HTMLInputElement>) => {
      setAvailablePerks((a) => {
        if (a.includes(id)) {
          return a.filter((c) => c !== id);
        }

        return [...a, id];
      });
    },
    [setAvailablePerks]
  );

  const handlePerkSelectAll = useCallback(
    (_: ChangeEvent<HTMLInputElement>) => {
      setAvailablePerks((a) => {
        if (a.length === SURVIVOR_PERKS.length) return [];

        return SURVIVOR_PERKS.map((c) => c.id);
      });
    },
    [setAvailablePerks]
  );

  const handleSubmit = useCallback(
    (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();

      onSubmit({
        ...player,
        availableCharacters,
        availablePerks,
        name,
      });
    },
    [availableCharacters, availablePerks, name, onSubmit, player]
  );

  return (
    <form onSubmit={handleSubmit}>
      <h3>Edit Player</h3>
      <p>Do stuff</p>
      <label>Name</label>
      <input onChange={handleNameChange} value={name} />
      <details>
        <summary>Available Characters</summary>
        <p>
          <input
            checked={availableCharacters.length === SURVIVOR_CHARACTERS.length}
            id="character-all"
            name="character-all"
            onChange={handleCharacterSelectAll}
            type="checkbox"
          />
          <label htmlFor="character-all">Select all</label>
        </p>
        <p>
          {SURVIVOR_CHARACTERS.map((character) => (
            <Fragment key={character.id}>
              <input
                checked={availableCharacters.includes(character.id)}
                id={`character-${character.id}`}
                name={`character-${character.id}`}
                onChange={handleCharacterSelect(character.id)}
                type="checkbox"
              />
              <label htmlFor={`character-${character.id}`}>
                {character.name}
              </label>
            </Fragment>
          ))}
        </p>
      </details>
      <details>
        <summary>Available Perks (e.g. Secret Shrine perks)</summary>
        <p>
          <input
            checked={availablePerks.length === SURVIVOR_PERKS.length}
            id="perk-all"
            name="perk-all"
            onChange={handlePerkSelectAll}
            type="checkbox"
          />
          <label htmlFor="perk-all">Select all</label>
        </p>
        <p>
          {SURVIVOR_PERKS.map((perk) => (
            <Fragment key={perk.id}>
              <input
                checked={availableCharacters.includes(perk.id)}
                id={`perk-${perk.id}`}
                name={`perk-${perk.id}`}
                onChange={handlePerkSelect(perk.id)}
                type="checkbox"
              />
              <label htmlFor={`perk-${perk.id}`}>{perk.name}</label>
            </Fragment>
          ))}
        </p>
      </details>
      <button role="submit">Submit</button>
      <button onClick={handleCancel}>Cancel</button>
    </form>
  );
};

export const App: FC = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [isAvoidingOverlapping, setAvoidingOverlapping] = useState(false);
  const [editPlayerState, setEditPlayerState] = useState<string | null>(null);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [randomizedPerks, setRandomizedPerks] = useState<RandomizedPerks>({});

  const handleAvoidOverlappingChange = useCallback(
    (_: ChangeEvent<HTMLInputElement>) => {
      setAvoidingOverlapping((p) => !p);
    },
    [setAvoidingOverlapping]
  );

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
    },
    [setPlayers]
  );

  const handlePlayerEditCancel = useCallback(() => {
    setEditPlayerState(null);
    dialogRef.current?.close();
  }, [dialogRef, setEditPlayerState]);

  const handlePlayerEditOpen = useCallback(
    (id: string) => (ev: MouseEvent<HTMLAnchorElement>) => {
      ev.preventDefault();

      setEditPlayerState(id);
      dialogRef.current?.showModal();
    },
    [dialogRef, setEditPlayerState]
  );

  const handlePlayerEditSubmit = useCallback(
    (newPlayer: Player) => {
      setEditPlayerState(null);
      setPlayers((p) =>
        p.map((player) => {
          if (player.id !== newPlayer.id) return player;

          return newPlayer;
        })
      );
      dialogRef.current?.close();
    },
    [dialogRef, setEditPlayerState, setPlayers]
  );

  const handleRandomize = useCallback(
    (ev: MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();

      const randomizedPerks: RandomizedPerks = {};

      const usedPerks = [];

      for (const player of players) {
        if (!player.isRandomizing) continue;

        const availablePerkIds = new Set(player.availablePerks);

        for (const charactedId of player.availableCharacters) {
          for (const characterPerkId of CHARACTER_PERKS_MAP[charactedId]) {
            availablePerkIds.add(characterPerkId);
          }
        }

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
    [isAvoidingOverlapping, players, setRandomizedPerks]
  );

  const handleRandomizingPlayerToggle = useCallback(
    (id: string) => (ev: MouseEvent<HTMLAnchorElement>) => {
      ev.preventDefault();

      setPlayers((p) =>
        p.map((player) => {
          if (player.id !== id) return player;

          return {
            ...player,
            isRandomizing: !player.isRandomizing,
          };
        })
      );
    },
    [setPlayers]
  );

  return (
    <>
      <dialog ref={dialogRef}>
        {editPlayerState && (
          <EditPlayerDialog
            onClose={handlePlayerEditCancel}
            onSubmit={handlePlayerEditSubmit}
            player={players.find((p) => p.id === editPlayerState)!}
          />
        )}
      </dialog>
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
                    <a href="#" onClick={handlePlayerEditOpen(player.id)}>
                      [Edit]
                    </a>
                    <a
                      href="#"
                      onClick={handleRandomizingPlayerToggle(player.id)}
                    >
                      {player.isRandomizing ? "[Exclude]" : "[Include]"}
                    </a>
                    <a href="#" onClick={handlePlayerDelete(player.id)}>
                      [Delete]
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <input
              checked={isAvoidingOverlapping}
              id="avoid-overlapping-input"
              name="avoid-overlapping-input"
              onChange={handleAvoidOverlappingChange}
              type="checkbox"
            />
            <label htmlFor="avoid-overlapping-input">
              Avoid overlapping perks?
            </label>
          </form>
        </section>
        <section>
          <header>
            <h3>Results</h3>
          </header>
          {players
            .filter((p) => p.isRandomizing)
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
      </main>
    </>
  );
};
