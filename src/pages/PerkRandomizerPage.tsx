import {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useRef,
  useState,
} from "react";

import { EditPlayerDialog } from "../components/EditPlayerDialog";
import { useConfig } from "../contexts/config";

import styles from "./PerkRandomizerPage.module.css";
import { usePlayers } from "../contexts/player";
import { Randomizer } from "../components/Randomizer";

export const PerkRandomizerPage: FC = () => {
  const {
    addRandomizingPlayerId,
    isAvoidingOverlapping,
    randomizingPlayerIds,
    removeRandomizingPlayerId,
    toggleAvoidingOverlapping,
  } = useConfig();

  const { addPlayer, players, removePlayer } = usePlayers();

  const dialogRef = useRef<HTMLDialogElement>(null);

  const [editPlayerState, setEditPlayerState] = useState<string | null>(null);
  const [newPlayerName, setNewPlayerName] = useState("");

  const handleAvoidOverlappingChange = useCallback(
    (_: ChangeEvent<HTMLInputElement>) => {
      toggleAvoidingOverlapping();
    },
    [toggleAvoidingOverlapping]
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

      setNewPlayerName("");
      const id = addPlayer({
        availableCharacters: [],
        availablePerks: [],
        name: newPlayerName,
      });
      addRandomizingPlayerId(id);
    },
    [addPlayer, addRandomizingPlayerId, newPlayerName, setNewPlayerName]
  );

  const handlePlayerDelete = useCallback(
    (id: string) => (ev: MouseEvent<HTMLAnchorElement>) => {
      ev.preventDefault();

      removePlayer(id);
    },
    [removePlayer]
  );

  const handlePlayerEditClose = useCallback(() => {
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

  const handleRandomizingPlayerToggle = useCallback(
    (id: string) => (ev: MouseEvent<HTMLAnchorElement>) => {
      ev.preventDefault();

      if (randomizingPlayerIds.includes(id)) {
        removeRandomizingPlayerId(id);
      } else {
        addRandomizingPlayerId(id);
      }
    },
    [addRandomizingPlayerId, randomizingPlayerIds, removeRandomizingPlayerId]
  );

  return (
    <>
      <dialog ref={dialogRef}>
        {editPlayerState && (
          <EditPlayerDialog
            onClose={handlePlayerEditClose}
            playerId={editPlayerState}
          />
        )}
      </dialog>
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
                    {randomizingPlayerIds.includes(player.id)
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
      <Randomizer />
    </>
  );
};
