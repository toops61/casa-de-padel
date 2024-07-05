import { useState } from "react";
import PlayersForm from "./components/PlayersForm";
import { useFieldsZustand, useInitialContainer, useModal, usePlayersZustand } from "./store";
import PlayersIcons from "./components/PlayersIcons";
import FieldsPart from "./components/FieldsPart";
import Modal from "./components/Modal";
import Popup from "./components/Popup";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

function App() {
  const [enter, setEnter] = useState(false);

  const { players,resetPlayers,addPlayerPlaced,removePlayerPlaced } = usePlayersZustand();
  const {initialPlayers,updateInitial,resetInitial } = useInitialContainer();
  const { resetFields,updateField,fields } = useFieldsZustand();
  const { modalObject } = useModal();

  const resetFunc = () => {
    resetPlayers();
    resetFields();
    resetInitial();
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    const sourceField = fields.find(field => source.droppableId.includes(field.id.toString()));
    const destinationField = fields.find(field => destination?.droppableId.includes(field.id.toString()));
    const sourceInitial = source.droppableId === "initial" ? true : false;
    const playerDragged = players.find(player => player.id === draggableId);
    const initialZoneArray = [...initialPlayers];

    if (destination) {
      const destinationInitial = destination.droppableId === "initial" ? true : false;
      
      //same drop zone between source and destination
      if (destination.droppableId === source.droppableId) {
        if (destination.index !== source.index) {

          //initial zone
          if (sourceInitial) {
            //invert players
            initialZoneArray.splice(destination.index,0,(initialZoneArray.splice(source.index,1)[0]));
            updateInitial(initialZoneArray);

          } else {
          //field zone
            if (sourceField) {
              const side = source.droppableId.includes('first') ? 'players_side1' : 'players_side2';
              const playersOriginArray = [...sourceField[side]];

              //invert players
              playersOriginArray.splice(destination.index,0,(playersOriginArray.splice(source.index,1)[0]));
              const newField = {...sourceField};
              newField[side] = playersOriginArray;
              updateField(newField);
            }
          }
        }
        //different drop zone between source and destination
      } else {
        //from initial zone to a field
        if (sourceInitial && destinationField) {
          const destinationSide = destination.droppableId.includes('first') ? 'players_side1' : 'players_side2';
          const playersDestinationArray = [...destinationField[destinationSide]];

          if (playersDestinationArray.length < 2) {
            //remove from initial zone
            const playerDropped = initialZoneArray.splice(source.index,1)[0];
            updateInitial(initialZoneArray);

            //add to destination
            playersDestinationArray.splice(destination.index,0,playerDropped.id);
            //update field
            const newField = {...destinationField};
            newField[destinationSide] = playersDestinationArray;
            updateField(newField);
            addPlayerPlaced([draggableId]);
          }
        } else {
          const sourceSide = source.droppableId.includes('first') ? 'players_side1' : 'players_side2';
          
          //remove from field
          if (playerDragged && sourceField) {
            const newSourceField = {...sourceField};
            const playersSourceArray = sourceField[sourceSide];
            const sameField = JSON.stringify(sourceField) === JSON.stringify(destinationField) ? true : false;
            
            playersSourceArray.splice(source.index,1);
            
            //from a field back to initial zone
            if (destinationInitial) {
              //remove player from player placed array
              removePlayerPlaced([draggableId]);

              //add to initial zone
              initialZoneArray.splice(destination.index,0,playerDragged);
              updateInitial(initialZoneArray);
            } else if (destinationField) {
            //from a field side to another field side
              const destinationSide = destination.droppableId.includes('first') ? 'players_side1' : 'players_side2';
              
              const newDestinationField = {...destinationField};
              const playersDestinationArray = sameField ? newSourceField[destinationSide] : newDestinationField[destinationSide];
              //switch places between players
              if (playersDestinationArray.length === 2) {
                const replacedPlayerId = playersDestinationArray[destination.index];
                //replace previous player in destination
                playersDestinationArray.splice(destination.index,1,draggableId);
                //insert new one in source array
                playersSourceArray.splice(source.index,0,replacedPlayerId);
              } else {
                //add to destination
                playersDestinationArray.splice(destination.index,0,draggableId);
              }
              /* //update field
              newDestinationField[destinationSide] = playersDestinationArray; */
              !sameField && updateField(newDestinationField);
            }
            //update source field
            //newSourceField[sourceSide] = playersSourceArray;
            updateField(newSourceField);
          }
        }
      }
    }
  };
  
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <main className="App">
        {modalObject.show && modalObject.type === 'modal' ? <Modal /> : <></>}
        {modalObject.show && modalObject.type === 'popup' ? <Popup /> : <></>}
        {!enter ?  <div className="open-container">
          <h1>Padel Seipra</h1>
          <button className="enter-btn" onClick={() => setEnter(!enter)}>
            <p>Entrez</p>
          </button>
        </div> : <div className="main-container">
          <button className="back icon" onClick={() => setEnter(!enter)}></button>
          <button className="reset" onClick={resetFunc}>Initialiser</button>
          <PlayersForm />
            
          {initialPlayers.length ? <PlayersIcons /> : <></>}
          {players.length > 1 ? 
            <FieldsPart /> : <></>
          }
        </div>}
      </main>
    </DragDropContext>
  )
}

export default App