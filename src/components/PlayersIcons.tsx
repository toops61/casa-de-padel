import { usePlayersZustand } from "../store";
import Player from "./Player";

export default function PlayersIcons() {

    const { players,playersPlaced } = usePlayersZustand();

  return (
    <div className="players-container">
        {players.filter(player => !playersPlaced.includes(player.id)).map(player => <Player player={player} key={player.id} />)}
    </div>
  )
}