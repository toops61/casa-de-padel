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
  removePlayers: (playerId: IDType[]) => void;
  resetPlayers: () => void;
}

export const usePlayersZustand = create<playerHandleType>(set => ({
  players: sessionStorage.players ? JSON.parse(sessionStorage.getItem('players')!) : [],
  playersPlaced: sessionStorage.playersPlaced ? JSON.parse(sessionStorage.getItem('playersPlaced')!) : [],
  addPlayer: player => set(state =>{
    const newPlayers = [...state.players, {name:player,id:nanoid()}].sort();
    sessionStorage.setItem('players',JSON.stringify(newPlayers));
    return { players: newPlayers }
}),
  addPlayerPlaced: array => set(state => {
    const previous = [...state.playersPlaced];
    array.map(e => !previous.includes(e) && previous.push(e));
    sessionStorage.setItem('playersPlaced',JSON.stringify(previous));
    return {playersPlaced:previous}
  }), 
  removePlayers: playerIdArray => set(state => {
    const newPlayers = state.players.filter(player => !playerIdArray.includes(player.id));
    sessionStorage.setItem('players',JSON.stringify(newPlayers));
    return { players: newPlayers }
  }),
  resetPlayers: () => set(() => {
    sessionStorage.setItem('players',JSON.stringify([]));
    sessionStorage.setItem('playersPlaced',JSON.stringify([]));
    return {players:[],playersPlaced:[]}
  })
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
  removeFields: (fields:IDType[]) => void;
  updateField: (field:fieldType) => void;
  updateFieldPlayers: (playersIds:IDType[],fieldID:IDType) => void;
  resetFields: () => void;
}

export const useFieldsZustand = create<fieldHandleType>(set => ({
  fields: sessionStorage.fields ? JSON.parse(sessionStorage.getItem('fields')!) : [],
  addFields: fieldsArray => set(() => {
    sessionStorage.setItem('fields',JSON.stringify(fieldsArray));
    return {fields:fieldsArray};
  }),
  removeFields: fieldsIdArray => set(state => {
    const previous = [...state.fields];
    fieldsIdArray.map(id => {
      const index = previous.findIndex(field => field.id === id);
      index !== -1 && previous.splice(index,1);
    })
    sessionStorage.setItem('fields',JSON.stringify(previous));
    return {fields:previous};
  }),
  updateField: field => set(state => {
    const previousArray = [...state.fields];
    const arrayId = state.fields.findIndex(e => e.id === field.id); 
    if (arrayId !== -1) {
      previousArray.splice(arrayId,1,field);
    }
    sessionStorage.setItem('fields',JSON.stringify(previousArray));
    return {fields:previousArray};
  }),
  updateFieldPlayers: (playersIds,fieldID) => {
    set(state => {
      const fieldsArray = [...state.fields];
      const arrayId = fieldsArray.findIndex(field => field.id === fieldID);      
      if (arrayId !== -1) {
        fieldsArray[arrayId].players_side1.length ? fieldsArray.splice(arrayId,1,{...fieldsArray[arrayId],players_side2:playersIds}) : fieldsArray.splice(arrayId,1,{...fieldsArray[arrayId],players_side1:playersIds});
        //set({ columns: columnsArray });
      }
      sessionStorage.setItem('fields',JSON.stringify(fieldsArray));
      return { fields: fieldsArray };
    })
  },
  resetFields: () => set(() => {
    sessionStorage.setItem('fields',JSON.stringify([]));
    return {fields:[]};
  })
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