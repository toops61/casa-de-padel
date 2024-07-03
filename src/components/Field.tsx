import { fieldType, usePlayersZustand } from "../store";
import Player from "./Player";

export default function Field({field}:{field:fieldType}) {
    const { players } = usePlayersZustand();    

  return (
    <div className="field">
        <div className="part">
            {field.players_side1.map(id => {
                const player = players.find(player => player.id === id);
                return player ? <Player player={player} key={id} /> : null
            })}
        </div>
        <div className="part">
            {field.players_side2.map(id => {
                const player = players.find(player => player.id === id);
                return player ? <Player player={player} key={id} /> : null
            })}
        </div>
    </div>
  )
}