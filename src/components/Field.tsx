import { fieldType, usePlayersZustand } from "../store";
import { useFields } from "../utils/hooks";
import Player from "./Player";

export default function Field({field}:{field:fieldType}) {
    const { players } = usePlayersZustand();
    const {redistributeOne} = useFields();

    const fullField = (field.players_side1.length + field.players_side2.length) === 4 ? true : false;

  return (
    <div className="field-container">
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
        <button onClick={() => {
                redistributeOne(field.id);
            }}>
            {!fullField ? "Remplir" : "Redistribuer"}
        </button>
    </div>
  )
}