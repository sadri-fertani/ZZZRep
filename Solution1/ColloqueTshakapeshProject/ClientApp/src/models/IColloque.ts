import { IInscription } from "./IInscription";

export interface IColloque {
    id: number,
    titre: string,
    description: string,
    typeId: number,
    typeName: string,
    cout: number,
    responsable: string,
    emplacement: string,
    nombreParticipantMax: number,
    dureeColloque: number,
    dateColloque: Date
    inscriptions: Array<IInscription>;
}