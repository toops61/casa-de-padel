import { playersType } from "../store";

export default function Player({player}:{player:playersType}) {
  return (
    <div className="player-container">
        <div className="icon"></div>
        <p>{player.name}</p>
    </div>
  )
}