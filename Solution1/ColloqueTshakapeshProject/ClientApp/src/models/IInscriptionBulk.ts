import { IParticipant } from "./IParticipant";
import { IColloque } from "./IColloque";

export interface IInscriptionBulk {
    participant: IParticipant,
    colloques: Array<IColloque>
}