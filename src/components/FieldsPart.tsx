import { useFieldsZustand } from "../store";
import { useFields } from "../utils/hooks";
import Field from "./Field";

export default function FieldsPart() {
  const [autoFill] = useFields();

  const { fields } = useFieldsZustand();

  return (
    <div className="fields-part-container">
      <div className="create-teams">
        <h3>Créer les équipes</h3>
        <button onClick={autoFill}>auto</button>
        <button>Manuel</button>
      </div>
      <div className="fields-container">
        {fields.map(field => <Field key={field.id} />)}
      </div>
    </div>
  )
}