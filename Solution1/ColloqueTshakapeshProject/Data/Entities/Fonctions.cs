using System.Collections.Generic;

namespace ColloqueTshakapeshProject.Data
{
    public partial class Fonctions
    {
        public Fonctions()
        {
            Participants = new HashSet<Participants>();
        }

        public string Nom { get; set; }

        public virtual ICollection<Participants> Participants { get; set; }
    }
}
