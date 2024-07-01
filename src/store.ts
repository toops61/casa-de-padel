import { create } from 'zustand';
import { IDType } from './utils/interfaces';
import { nanoid } from 'nanoid';

export interface playersType {
  name: string;
  id: IDType;
}

interface playerHandleType {
  players: playersType[];
  addPlayer: (player: string) => void;
  removePlayer: (playerId: IDType) => void;
}

export const usePlayersZustand = create<playerHandleType>(set => ({
  players: [],
  addPlayer: player => set(state =>({ players: [...state.players, {name:player,id:nanoid()}].sort() })),
  removePlayer: playerId => set(state => ({ players: state.players.filter((e) => e.id !== playerId) }))
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