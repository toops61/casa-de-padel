import { useModal, usePlayersZustand } from "../store";
import { nanoid } from "nanoid";
import { playersData } from "../utils/data";
import { ChangeEvent } from "react";

export default function PlayersForm() {
    const playersDB = playersData.map(player => ({name:player,id:nanoid()})).sort((a,b) => a.name < b.name ? -1 : 1);

    const { showModal } = useModal();
    const { players,playersPlaced,addPlayer } = usePlayersZustand();

    const selectPlayer = (e:ChangeEvent<HTMLSelectElement>) => {
        const newSelected = e.target.value;
        addPlayer(newSelected);
    }

    const addNewPlayer = (e:ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newPlayer = e.target.newPlayer.value.trim();
        if (newPlayer && !players.some(player => player.name === newPlayer)) {
            addPlayer(newPlayer);
            showModal('Nouveau joueur créé','');
        } else {
            const response = newPlayer ? `Il existe déjà un joueur ${newPlayer}` : 'Il faut donner un nom au joueur...'
            showModal(response);
        }
        e.target.newPlayer.value = '';
    }

  return (
    <form className="players-form" onSubmit={addNewPlayer}>
        <h2>Joueurs</h2>
        <div className="inputs-container">
            <div className="players-input">
                <label htmlFor="players">Joueurs</label>
                <select name="players" onChange={selectPlayer}>
                    <option value="">Sélectionnez les joueurs</option>
                    {playersDB.filter(e => !players.some(el => el.name === e.name) && !playersPlaced.some(el => el === e.id)).map(player => <option value={player.name} key={player.id}>{player.name}</option>)}
                </select>
            </div>
            <div className="new-player-input">
                <label htmlFor="newPlayer">Ajoutez un nouveau joueur</label>
                <div className="add">
                    <input type="text" name="newPlayer" />
                    <button className="btn-add icon" role="submit"></button>
                </div>
            </div>
        </div>
    </form>
  )
}