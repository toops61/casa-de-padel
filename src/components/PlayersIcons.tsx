import { usePlayersZustand } from "../store";
import Player from "./Player";

export default function PlayersIcons() {

    const { players } = usePlayersZustand();

  return (
    <div className="players-container">
        {players.map(player => <Player player={player} key={player.id} />)}
    </div>
  )
}