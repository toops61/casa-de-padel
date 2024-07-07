import { Draggable } from "react-beautiful-dnd";
import { playersType } from "../store";

export default function Player({player,index}:{player:playersType,index:number}) {
  return (
    <Draggable draggableId={player.id.toString()} index={index} >
      {(provided,snapshot) => (
        <div 
          className="player-container"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
            <div className={"icon" + (snapshot.isDragging ? " dragging" : "")}></div>
            <p>{player.name}</p>
        </div>
      )}
    </Draggable>
  )
}