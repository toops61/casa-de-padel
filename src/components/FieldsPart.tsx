import { useFieldsZustand, useInitialContainer } from "../store";
import { useFields } from "../utils/hooks";
import Field from "./Field";

export default function FieldsPart() {
  const {autoFill,buildFields} = useFields();

  const { fields } = useFieldsZustand();
  const { initialPlayers } = useInitialContainer();

  return (
    <div className="fields-part-container">
      <div className="create-fields">
        {initialPlayers.length >= 4 ? <>
          <h3>Créer les équipes</h3>
          <button className="color-button" onClick={autoFill}>auto</button>
          <button className="color-button" onClick={buildFields}>Manuel</button>
        </> : (fields.length > 1 ? <button className="color-button" onClick={autoFill}>Redistribuer les terrains</button> : <></>)}
      </div>
      <div className="fields-container">
        {fields.map(field => <Field key={field.id} field={field} />)}
      </div>
    </div>
  )
}