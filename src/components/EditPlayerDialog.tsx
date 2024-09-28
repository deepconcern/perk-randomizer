import {
  ChangeEvent,
  FC,
  FormEvent,
  Fragment,
  MouseEvent,
  useCallback,
  useState,
} from "react";

import { usePlayers } from "../contexts/player";
import { SURVIVOR_CHARACTERS, SURVIVOR_PERKS } from "../lib/data";

export type EditPlayerDialogProps = {
  onClose: () => void;
  playerId: string;
};

export const EditPlayerDialog: FC<EditPlayerDialogProps> = ({
  onClose,
  playerId,
}) => {
  const { playerMap, updatePlayer } = usePlayers();

  const player = playerMap[playerId];

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

      updatePlayer(player.id, {
        ...player,
        availableCharacters,
        availablePerks,
        name,
      });
      onClose();
    },
    [availableCharacters, availablePerks, name, onClose, player, updatePlayer]
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
