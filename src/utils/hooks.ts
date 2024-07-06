import { fieldType, useFieldsZustand, useInitialContainer, useModal, usePlayersZustand } from "../store";
import { nanoid } from "nanoid";
import { IDType } from "./interfaces";
import { getRandomArray } from "./utilFuncs";

export const useFields = () => {
    const { players,addPlayerPlaced } = usePlayersZustand();
    const { initialPlayers,updateInitial } = useInitialContainer();
    const { fields,addFields,updateField } = useFieldsZustand();
    const { showModal } = useModal();

    class Field {
      constructor(public id:IDType,public players_side1:IDType[],public players_side2:IDType[]) {}
    }

    //update playerPlaced and initialPlayers
    const updatePlayerPlaced = (tempFields:fieldType[]) => {
      let tempInitial = [...initialPlayers];
            
      tempFields.map(field => {
        addPlayerPlaced(field.players_side1);
        addPlayerPlaced(field.players_side2);
        const fieldPlayersIds = [...field.players_side1].concat(field.players_side2);
        tempInitial = tempInitial.filter(player => !fieldPlayersIds.includes(player.id));
      })
      updateInitial(tempInitial);
    }
    
    //create fields
    const createFields = () => {
      const playersToAdd = players.length;
      const rest = playersToAdd%4;
      const fieldsNumber = rest > 1 ? Math.ceil(playersToAdd/4) : Math.floor(playersToAdd/4);
      const arrayFields = [...fields];
      const created = fieldsNumber - fields.length;
      
      if (created) {
        for (let i = 0; i < created; i++) {
          const newField = new Field(nanoid(),[],[]);
          arrayFields.push(newField);
        }
        
        showModal(`création ${created > 1 ? 'de ' : 'd\''}${created} terrain${created > 1 ? 's' : ''}`,'');
      }
      
      //return new total fields
      return arrayFields;
    }

    //manual mode
    const buildFields = () => {
      const arrayFields = createFields();
      addFields(arrayFields);
    }

    //fill fields with players
    /* const fillFields = (arrayFields:fieldType[]) => {
      let playersTemp = players.map(e => ({...e}));

      //fill 1 field
      if (arrayFields.length === 1 && !arrayFields[0].players_side1.length && !arrayFields[0].players_side2.length) {
        playersTemp = [...initialPlayers];
      }

      //redistribute all fields with same players
      if (arrayFields.length > 1 && (playersPlaced.length - players.length)%4) {
        playersTemp = playersTemp.filter(player => playersPlaced.includes(player.id));
      }

      const tempFields : fieldType[] = arrayFields.map(e => ({...e,players_side1:[],players_side2:[]}));
      if (arrayFields.length === 1 && arrayFields[0].players_side1.length) {
        const ids = arrayFields[0].players_side1.concat(arrayFields[0].players_side2);
        playersTemp = players.filter(e => ids.includes(e.id));
      }

      //create random ids array from playersTemp
      const arrayIds = getRandomArray(playersTemp.length);
      let tempArray : IDType[] = [];
      arrayIds.map((e,ind) => {
        tempArray.push(playersTemp[e].id);
        if ((ind+1)%2 === 0) {
          const fieldToFill = tempFields.find(field => !field.players_side1.length || !field.players_side2.length);
          //console.log(fieldToFill);
          if ( fieldToFill) (!fieldToFill.players_side1.length ? fieldToFill.players_side1 = tempArray : fieldToFill.players_side2 = tempArray);
          tempArray = [];
        }
      })
      //update playerPlaced array and initial players
      updatePlayerPlaced(tempFields);
      return tempFields;
    } */
    
      //default reset
    const fillFields = (arrayFields:fieldType[],reset:boolean=true) => {
      //initialize fields if needed
      const tempFields = reset ? arrayFields.map(e => ({...e,players_side1:[],players_side2:[]})) : [...arrayFields];

      let playersFields = [...players];

      //redistribute only one
      if (arrayFields.length === 1 && (arrayFields[0].players_side1.length || arrayFields[0].players_side2.length)) {
        const ids = [...arrayFields[0].players_side1].concat(arrayFields[0].players_side2);
        playersFields = players.filter(player => ids.includes(player.id));
      }

      const playersTemp = reset ? playersFields : initialPlayers;
      const playersToPlace = playersTemp.map(e => ({...e}));

      //create random ids array from playersTemp
      const arrayIndex = getRandomArray(playersToPlace.length);
      const arrayIds = arrayIndex.map(e => playersToPlace[e].id);

      let arrayIdsInd = 0;

      //add id to half side if needed
      const fillHalfField = (field:fieldType,playersPerSide:number,firstSide:boolean=true) => {
        const side = firstSide ? 'players_side1' : 'players_side2';
        const array = field[side];

        const idToAdd = playersPerSide - array.length;
        if (idToAdd && (arrayIdsInd < arrayIds.length)) {
          for (let i = 0; i < idToAdd; i++) {
            array.push(arrayIds[arrayIdsInd]);
            arrayIdsInd++;
          }
        } 
      }
      
      tempFields.map(field => {
        //if only 2 players left for last field
        const playersPerSide = (arrayIds.length - arrayIdsInd <= 2) ? 1 : 2;
        //first side
        fillHalfField(field,playersPerSide);
        //second side
        fillHalfField(field,playersPerSide,false);
      })

      //update playerPlaced array and initial players
      updatePlayerPlaced(tempFields);
      return tempFields;
    }

    //mode auto
    const autoFill = () => {
      const arrayFields = createFields();
      const fieldsFilled = fillFields(arrayFields);
      //update zustand fields
      addFields(fieldsFilled);
    }    

    const fillOne = (fieldId:IDType) => {
      const field = fields.find(e => e.id === fieldId);
      if (field) {
        const reset = (field.players_side1.length + field.players_side2.length === 4) || !initialPlayers.length ? true : false;
        const newField = fillFields([field],reset);
        newField.length && updateField(newField[0]);
      }
    }

    return {autoFill,fillOne,buildFields};
}