import { useEffect } from "react";
import { useFieldsZustand, useModal, usePlayersZustand } from "../store";
import { nanoid } from "nanoid";
import { IDType } from "./interfaces";

export const useFields = () => {
    const { players } = usePlayersZustand();
    const { fields,addFields,updateFieldPlayers } = useFieldsZustand();
    const { showModal } = useModal();

    class Field {
      constructor(public id:IDType,public players_side1:IDType[],public players_side2:IDType[]) {
        
      }
    }
    /* const autoFill = useCallback(() => {
      }, []); */
      const autoFill = () => {
        const fieldsNumber = Math.ceil(players.length/4);
        const rest = players.length%4;
        const arrayFields = [];
        if (!rest) {
          showModal(`création de ${fieldsNumber} terrain${fieldsNumber > 1 ? 's' : ''}`,'');
          for (let i = 0; i < fieldsNumber; i++) {
            const newField = new Field(nanoid(),[],[]);
            arrayFields.push(newField);
          }
          addFields(arrayFields);
          
        } else {
           showModal('Attention il manque des joueurs');
        }
    }

    useEffect(() => {
      console.log('joueurs :',players,'terrains : ',fields);
      
    }, [players,fields])
    
    return [autoFill] as const;
}