import { useEffect } from "react";
import { fieldType, useFieldsZustand, useModal, usePlayersZustand } from "../store";
import { nanoid } from "nanoid";
import { IDType } from "./interfaces";
import { getRandomArray } from "./utilFuncs";

export const useFields = () => {
    const { players,playersPlaced,addPlayerPlaced } = usePlayersZustand();
    const { fields,addFields,updateField } = useFieldsZustand();
    const { showModal } = useModal();

    class Field {
      constructor(public id:IDType,public players_side1:IDType[],public players_side2:IDType[]) {}
    }
    
    const createFields = (start:boolean=true) => {
      const playersToAdd = players.length - (start ? 0 : playersPlaced.length);
      const fieldsNumber = Math.ceil(playersToAdd/4);
      const rest = playersToAdd%4;
      const arrayFields : fieldType[] = [];
      if (!rest) {
        showModal(`création ${fieldsNumber > 1 ? 'de ' : 'd\''}${fieldsNumber} terrain${fieldsNumber > 1 ? 's' : ''}`,'');
        for (let i = 0; i < fieldsNumber; i++) {
          const newField = new Field(nanoid(),[],[]);
          arrayFields.push(newField);
        }
        
        return arrayFields;
        
      } else {
          showModal('Attention il manque des joueurs');
      }
    }

    //fill fields with players
    const fillFields = (arrayFields:fieldType[]) => {
      let playersTemp = players.map(e => ({...e}));

      //fill 1 field
      if (arrayFields.length === 1 && !arrayFields[0].players_side1.length && !arrayFields[0].players_side2.length) {
        playersTemp = playersTemp.filter(player => !playersPlaced.includes(player.id));
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
      //const playersTemp = arrayFields.length === 1 ? 
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
      return tempFields;
    }

    const autoFill = () => {
      const arrayFields = createFields();
      if (arrayFields) {
        const fieldsFilled = fillFields(arrayFields);
        addFields(fieldsFilled);
      }
    }

    const buildFields = () => {
      const arrayFields = createFields(false);
      const previousFields = fields.filter(field => (field.players_side1.length + field.players_side1.length) === 4);
      arrayFields && addFields([...previousFields,...arrayFields]);
    }

    const redistributeAll = () => {
      const newFields = fillFields(fields);
      addFields(newFields);
    }

    const redistributeOne = (fieldId:IDType) => {
      const field = fields.find(e => e.id === fieldId);
      if (field) {
        const newField = fillFields([field]);
        newField.length && updateField(newField[0]);
      }
    }

    useEffect(() => {
      if (fields.length) {
        fields.map(field => {
          addPlayerPlaced(field.players_side1);
          addPlayerPlaced(field.players_side2);
        })
      }
    }, [fields])
    
    return {autoFill,redistributeAll,redistributeOne,buildFields};
}