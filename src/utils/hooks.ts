import { useEffect } from "react";
import { fieldType, useFieldsZustand, useModal, usePlayersZustand } from "../store";
import { nanoid } from "nanoid";
import { IDType } from "./interfaces";
import { getRandomArray } from "./utilFuncs";

export const useFields = () => {
    const { players,addPlayerPlaced } = usePlayersZustand();
    const { fields,addFields } = useFieldsZustand();
    const { showModal } = useModal();

    class Field {
      constructor(public id:IDType,public players_side1:IDType[],public players_side2:IDType[]) {}
    }
    /* const autoFill = useCallback(() => {
      }, []); */
      const autoFill = () => {
        const fieldsNumber = Math.ceil(players.length/4);
        const rest = players.length%4;
        const arrayFields : fieldType[] = [];
        if (!rest) {
          showModal(`création de ${fieldsNumber} terrain${fieldsNumber > 1 ? 's' : ''}`,'');
          for (let i = 0; i < fieldsNumber; i++) {
            const newField = new Field(nanoid(),[],[]);
            arrayFields.push(newField);
          }
          const arrayIds = getRandomArray(players.length);
          //console.log(arrayIds);
          let tempArray : IDType[] = [];
          arrayIds.map((e,ind) => {
            tempArray.push(players[e].id);
            if ((ind+1)%2 === 0) {
              const fieldToFill = arrayFields.find(field => !field.players_side1.length || !field.players_side2.length);
              //console.log(fieldToFill);
              if ( fieldToFill) (!fieldToFill.players_side1.length ? fieldToFill.players_side1 = tempArray : fieldToFill.players_side2 = tempArray);
              tempArray = [];
            }
          })
          addFields(arrayFields);
        } else {
           showModal('Attention il manque des joueurs');
        }
    }

    useEffect(() => {
      if (fields.length) {
        fields.map(field => {
          addPlayerPlaced(field.players_side1);
          addPlayerPlaced(field.players_side2);
        })
        //console.log('terrains : ',fields);
        
      }
    }, [fields])
    
    return [autoFill] as const;
}