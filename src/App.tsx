import { useState } from "react";
import PlayersForm from "./components/PlayersForm";
import { usePlayers } from "./utils/hooks";

function App() {
  const [enter, setEnter] = useState(false);

  usePlayers();

  return (
    <main className="App">
      {!enter ?  <div className="open-container">
        <h1>Padel Seipra</h1>
        <button className="enter-btn" onClick={() => setEnter(!enter)}>
          <p>Entrez</p>
        </button>
      </div> : <div className="main-container">
        <div className="back" onClick={() => setEnter(!enter)}></div>
        <PlayersForm />
      </div>}
    </main>
  )
}

export default App