import { create } from 'zustand';
import { IDType } from './utils/interfaces';
import { nanoid } from 'nanoid';

//HANDLE PLAYERS
export interface playersType {
  name: string;
  id: IDType;
}

interface playerHandleType {
  players: playersType[];
  playersPlaced: IDType[];
  addPlayer: (player: string) => void;
  addPlayerPlaced: (playersIdArray:IDType[]) => void;
  removePlayer: (playerId: IDType) => void;
  resetPlayers: () => void;
}

export const usePlayersZustand = create<playerHandleType>(set => ({
  players: [],
  playersPlaced: [],
  addPlayer: player => set(state =>({ players: [...state.players, {name:player,id:nanoid()}].sort() })),
  addPlayerPlaced: array => set(state => {
    const previous = [...state.playersPlaced];
    array.map(e => !previous.includes(e) && previous.push(e));
    return {playersPlaced:previous}
  }), 
  removePlayer: playerId => set(state => ({ players: state.players.filter((e) => e.id !== playerId) })),
  resetPlayers: () => set(({players:[],playersPlaced:[]}))
}));

//HANDLE FIELDS
export interface fieldType {
  id: IDType;
  players_side1: IDType[];
  players_side2: IDType[];
}

interface fieldHandleType {
  fields: fieldType[];
  addFields: (fields:fieldType[]) => void;
  updateFieldPlayers: (playersIds:IDType[],fieldID:IDType) => void;
  resetFields: () => void;
}

export const useFieldsZustand = create<fieldHandleType>(set => ({
  fields: [],
  addFields: fieldsArray => set(() => {
    //const newArray = state.fields.concat(fieldsArray);
    return {fields:fieldsArray}
  }),
  updateFieldPlayers: (playersIds,fieldID) => {
    set(state => {
      const fieldsArray = state.fields;
      const arrayId = state.fields.findIndex(field => field.id === fieldID);      
      if (arrayId !== -1) {
        fieldsArray[arrayId].players_side1.length ? fieldsArray.splice(arrayId,1,{...fieldsArray[arrayId],players_side2:playersIds}) : fieldsArray.splice(arrayId,1,{...fieldsArray[arrayId],players_side1:playersIds});
        //set({ columns: columnsArray });
      }
      return { fields: fieldsArray };
    })
  },
  resetFields: () => set(({fields:[]}))
}));

//POPUP and MODAL part
interface modalType {
  modalObject: {
    show: boolean;
    message: string;
    valid: boolean; //alert
    type: string; //popup|modal
  };
  showModal: (message:string,valid?:string,type?:string) => void;
  initModal: () => void;
}

export const useModal = create<modalType>(set => ({
  modalObject: {
    show: false,
    message: '',
    valid: false,
    type: 'popup'
  },
  showModal: (message,valid='alert',type='popup') => set({
    modalObject: {
      show: true,
      message,
      valid: valid !== 'alert' ? true : false,
      type
    }
  }),
  initModal: () => set({modalObject:{show: false,message: '',valid: false,type:'popup'}})
}));