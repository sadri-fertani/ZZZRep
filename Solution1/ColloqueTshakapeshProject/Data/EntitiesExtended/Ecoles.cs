using System;

namespace ColloqueTshakapeshProject.Data
{
    public partial class Ecoles : TEntity, ICloneable
    {
        public object Clone()
        {
            return new Ecoles
            {
                Id = this.Id,
                Nom = this.Nom,
                Email = this.Email,
                Telephone = this.Telephone,
                Adresse = this.Adresse,
                Participants = null         // (from p in (new List<Participants>(this.Participants)) select p.Clone() as Participants).ToList()
            };
        }

        public override bool Equals(object obj)
        {
            Ecoles extObj = obj as Ecoles;

            return (extObj != null) && (
                    extObj.Nom.Equals(this.Nom)
                    && extObj.Adresse.Equals(this.Adresse)
                );
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }
    }
}