import {
  ChangeEvent,
  FC,
  FormEvent,
  Fragment,
  MouseEvent,
  useCallback,
  useMemo,
  useState,
} from "react";

import { usePlayers } from "../hooks/usePlayers";
import { CHARACTER_PERKS_MAP, SURVIVOR_CHARACTERS, SURVIVOR_PERKS } from "../lib/data";

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

  const [availablePerkIds, setAvailablePerkIds] = useState(player.availablePerkIds);
  const [name, setName] = useState(player.name);

  const selectedCharacterIds = useMemo(() => {
    const selectedCharacterIds = [];

    for (const characterId of Object.keys(CHARACTER_PERKS_MAP)) {
      let hasCharacter = true;

      for (const characterPerkId of CHARACTER_PERKS_MAP[characterId]) {
        if (!availablePerkIds.includes(characterPerkId)) {
          hasCharacter = false;
          break;
        }
      }

      if (hasCharacter) {
        selectedCharacterIds.push(characterId);
      }
    }

    return selectedCharacterIds;
  }, [availablePerkIds]);

  const handleCancel = useCallback(
    (ev: MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      onClose();
    },
    [onClose]
  );

  const handleCharacterSelect = useCallback(
    (id: string) => (_: ChangeEvent<HTMLInputElement>) => {
      if (selectedCharacterIds.includes(id)) {
        setAvailablePerkIds(availablePerkIds => availablePerkIds.filter(a => !CHARACTER_PERKS_MAP[id].includes(a)));
      } else {
        setAvailablePerkIds(a => [...a, ...CHARACTER_PERKS_MAP[id]]);
      }
    },
    [selectedCharacterIds, setAvailablePerkIds]
  );

  const handleCharacterSelectAll = useCallback(
    (_: ChangeEvent<HTMLInputElement>) => {
      setAvailablePerkIds(availablePerkIds => {
        const updatedAvailablePerkIds = [...availablePerkIds];

        if (selectedCharacterIds.length !== SURVIVOR_CHARACTERS.length) {
          for (const character of SURVIVOR_CHARACTERS) {
            for (const characterPerkId of CHARACTER_PERKS_MAP[character.id]) {
              if (!updatedAvailablePerkIds.includes(characterPerkId)) {
                updatedAvailablePerkIds.push(characterPerkId);
              }
            }
          }
        } else {
          for (const character of SURVIVOR_CHARACTERS) {
            for (const characterPerkId of CHARACTER_PERKS_MAP[character.id]) {
              updatedAvailablePerkIds.splice(updatedAvailablePerkIds.indexOf(characterPerkId), 1);
            }
          }
        }

        return updatedAvailablePerkIds;
      });
    },
    [selectedCharacterIds, setAvailablePerkIds]
  );

  const handleNameChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      setName(ev.target.value);
    },
    [setName]
  );

  const handlePerkSelect = useCallback(
    (id: string) => (_: ChangeEvent<HTMLInputElement>) => {
      setAvailablePerkIds((a) => {
        if (a.includes(id)) {
          return a.filter((c) => c !== id);
        }

        return [...a, id];
      });
    },
    [setAvailablePerkIds]
  );

  const handlePerkSelectAll = useCallback(
    (_: ChangeEvent<HTMLInputElement>) => {
      setAvailablePerkIds((a) => {
        if (a.length === SURVIVOR_PERKS.length) return [];

        return SURVIVOR_PERKS.map((c) => c.id);
      });
    },
    [setAvailablePerkIds]
  );

  const handleSubmit = useCallback(
    (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();

      updatePlayer(player.id, {
        ...player,
        availablePerkIds,
        name,
      });
      onClose();
    },
    [availablePerkIds, name, onClose, player, updatePlayer]
  );

  return (
    <form onSubmit={handleSubmit}>
      <h3>Edit Player</h3>
      <p>Do stuff</p>
      <label>Name</label>
      <input onChange={handleNameChange} value={name} />
      <details>
        <summary>Available Perks by Character</summary>
        <p>
          <input
            checked={selectedCharacterIds.length === SURVIVOR_CHARACTERS.length}
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
                checked={selectedCharacterIds.includes(character.id)}
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
        <summary>Available Perks (Individually selected)</summary>
        <p>
          <input
            checked={availablePerkIds.length === SURVIVOR_PERKS.length}
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
                checked={availablePerkIds.includes(perk.id)}
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
