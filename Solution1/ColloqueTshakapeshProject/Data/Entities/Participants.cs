using System.Collections.Generic;

namespace ColloqueTshakapeshProject.Data
{
    public partial class Participants
    {
        public Participants()
        {
            Inscriptions = new HashSet<Inscriptions>();
        }

        public string Nom { get; set; }
        public string Prenom { get; set; }
        public string Courriel { get; set; }
        public string Telephone { get; set; }
        public int? FonctionId { get; set; }
        public int? EcoleId { get; set; }
        public virtual Ecoles Ecole { get; set; }
        public virtual Fonctions Fonction { get; set; }
        public virtual ICollection<Inscriptions> Inscriptions { get; set; }
    }
}
