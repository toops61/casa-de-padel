import { Droppable } from "react-beautiful-dnd";
import { fieldType, useInitialContainer, usePlayersZustand } from "../store";
import { useFields } from "../utils/hooks";
import Player from "./Player";

export default function Field({field}:{field:fieldType}) {
    const { players } = usePlayersZustand();
    const { initialPlayers } = useInitialContainer();
    const {fillOne} = useFields();

    const fullField = (field.players_side1.length + field.players_side2.length) === 4 ? true : false;    

  return (
    <div className="field-container">
        <div className="field">
            <Droppable droppableId={field.id.toString()+'first'} direction="horizontal">
                {(provided) => (
                    <div 
                        className="part"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {field.players_side1.map((id,index) => {
                            const player = players.find(player => player.id === id);
                            return player ? <Player player={player} index={index} key={id} /> : null
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <Droppable droppableId={field.id.toString()+'second'} direction="horizontal">
                {(provided) => (
                    <div 
                        className="part"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {field.players_side2.map((id,index) => {
                            const player = players.find(player => player.id === id);
                            return player ? <Player player={player} index={index} key={id} /> : null
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
        <button onClick={() => {
                fillOne(field.id);
            }}>
            {fullField || !initialPlayers.length ? "Redistribuer" : "Remplir"}
        </button>
    </div>
  )
}