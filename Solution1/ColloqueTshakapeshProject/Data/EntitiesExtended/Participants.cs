using System;

namespace ColloqueTshakapeshProject.Data
{
    public partial class Participants : TEntity, ICloneable
    {
        public object Clone()
        {
            return new Participants
            {
                Id = this.Id,
                Nom = this.Nom,
                Prenom = this.Prenom,
                Courriel = this.Courriel,
                Telephone = this.Telephone,
                EcoleId = this.EcoleId,
                Ecole = null,
                FonctionId = this.FonctionId,
                Fonction = null,
            };
        }
    }
}
