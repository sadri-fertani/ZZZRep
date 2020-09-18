export interface IParticipant {
    id: number;
    nom: string;
    prenom: string;
    courriel: string;
    telephone: string;
    fonctionId?: number;
    fonctionName: string;
    ecoleId?: number;
    ecoleName: string;
}