import { useEffect, useState } from "react"
import { playersType, usePlayersZustand } from "../store";

export const usePlayers = () => {
    const { players } = usePlayersZustand();

    const [selectedPlayers, setSelectedPlayers] = useState<playersType[]>([]);
    
    useEffect(() => {
      console.log(players);
    }, [])

    return players;
    
}