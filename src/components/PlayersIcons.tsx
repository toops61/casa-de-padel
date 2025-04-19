import { Droppable } from "react-beautiful-dnd";
import { useFieldsZustand, useInitialContainer, usePlayersZustand } from "../store";
import { IDType } from "../utils/interfaces";
import Player from "./Player";

export default function PlayersIcons() {

  const { removePlayers } = usePlayersZustand();
  const { initialPlayers,resetInitial } = useInitialContainer();
  const { fields,removeFields } = useFieldsZustand();

  const resetPlayers = () => {
    removePlayers(initialPlayers.map(e => e.id));
    const fieldsToDelete : IDType[] = [];
    fields.map(field => !(field.players_side1.length + field.players_side2.length) && fieldsToDelete.push(field.id));
    fieldsToDelete.length && removeFields(fieldsToDelete);
    resetInitial();
  }

  return (
    <Droppable droppableId="initial" direction="horizontal">
      {((provided,snapshot) => (
          <div 
            className={"players-container" + (snapshot.isDraggingOver ? " dragging-over" : "")}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
              <button className="reset-players icon" onClick={resetPlayers}></button>
              {initialPlayers.map((player,index) => <Player player={player} index={index} key={player.id} />)}
              {provided.placeholder}
          </div>
      ))}
    </Droppable>
  )
}