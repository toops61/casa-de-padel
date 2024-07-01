import { usePlayersZustand } from "../store";
import { nanoid } from "nanoid";
import { playersData } from "../utils/data";

export default function PlayersForm() {
    const playersDB = playersData.map(player => ({name:player,id:nanoid()})).sort((a,b) => a.name < b.name ? -1 : 1);

    const { players } = usePlayersZustand();

  return (
    <form className="players-form">
        <h2>Joueurs</h2>
        <div className="inputs-container">
            <div className="players-input">
                <label htmlFor="players">Sélectionnez les joueurs</label>
                <select name="players">
                    {playersDB.filter(e => !players.some(el => el.name === e.name)).map(player => <option value={player.name} key={player.id}>{player.name}</option>)}
                </select>
            </div>
            <div className="new-player-input">
                <label htmlFor="new-player">Ajoutez un nouveau joueur</label>
                <div className="add">
                    <input type="text" name="new-player" />
                    <div className="btn-add"></div>
                </div>
            </div>
        </div>
    </form>
  )
}