import { useEffect, useState } from "react";
import { useModal } from "../store";

export default function Modal() {
    const [appears, setAppears] = useState(false);
    const { modalObject,initModal } = useModal();

    useEffect(() => {
        setAppears(true);
        setTimeout(() => {
            initModal()
        }, 2000);
    }, [])
    
  return (
    <div className="modal-background">
        <div className={"modal" + (!modalObject.valid ? " alert" : "") + (appears ? " appears" : "")}>
            <p>{modalObject.message}</p>
        </div>
    </div>
  )
}