import { useEffect, useState } from "react";
import { useModal } from "../store";

export default function Popup() {
    const [appears, setAppears] = useState(false);
    const { modalObject,initModal } = useModal();

    useEffect(() => {
        setAppears(true);
        setTimeout(() => {
            setAppears(false);
        }, 1600);
        setTimeout(() => {
            initModal()
        }, 2000);        
    }, [])
    
  return (
    <div className={"popup" + (!modalObject.valid ? " alert" : "") + (appears ? " appears" : "")}>
        <p>{modalObject.message}</p>
    </div>
  )
}