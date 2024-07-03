import { useFieldsZustand, usePlayersZustand } from "../store";
import { IDType } from "../utils/interfaces";
import Player from "./Player";

export default function PlayersIcons() {

  const { players,playersPlaced,removePlayers } = usePlayersZustand();

  const { fields,removeFields } = useFieldsZustand();

  const resetPlayers = () => {
    const playersToDelete = players.filter(player => !playersPlaced.includes(player.id)).map(player => player.id);
    removePlayers(playersToDelete);
    const fieldsToDelete : IDType[] = [];
    fields.map(field => (field.players_side1.length + field.players_side2.length) < 4 && fieldsToDelete.push(field.id));
    fieldsToDelete.length && removeFields(fieldsToDelete);
  }

  return (
    <div className="players-container">
        <button className="reset-players icon" onClick={resetPlayers}></button>
        {players.filter(player => !playersPlaced.includes(player.id)).map(player => <Player player={player} key={player.id} />)}
    </div>
  )
}