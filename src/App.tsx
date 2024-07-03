import { useState } from "react";
import PlayersForm from "./components/PlayersForm";
import { useFieldsZustand, useModal, usePlayersZustand } from "./store";
import PlayersIcons from "./components/PlayersIcons";
import FieldsPart from "./components/FieldsPart";
import Modal from "./components/Modal";
import Popup from "./components/Popup";

function App() {
  const [enter, setEnter] = useState(false);

  const { players,playersPlaced,resetPlayers } = usePlayersZustand();
  const { resetFields } = useFieldsZustand();
  const { modalObject } = useModal();

  const resetFunc = () => {
    resetPlayers();
    resetFields();
  }
  
  return (
    <main className="App">
      {modalObject.show && modalObject.type === 'modal' ? <Modal /> : <></>}
      {modalObject.show && modalObject.type === 'popup' ? <Popup /> : <></>}
      {!enter ?  <div className="open-container">
        <h1>Padel Seipra</h1>
        <button className="enter-btn" onClick={() => setEnter(!enter)}>
          <p>Entrez</p>
        </button>
      </div> : <div className="main-container">
        <button className="back" onClick={() => setEnter(!enter)}></button>
        <button className="reset" onClick={resetFunc}>Initialiser</button>
        <PlayersForm />
          
        {players.filter(player=>!playersPlaced.includes(player.id)).length ? <PlayersIcons /> : <></>}
        {players.length > 1 || playersPlaced.length ? 
          <FieldsPart /> : <></>
        }
      </div>}
    </main>
  )
}

export default App