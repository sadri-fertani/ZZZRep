using System.Collections.Generic;

namespace ColloqueTshakapeshProject.Data
{
    public partial class Ecoles
    {
        public Ecoles()
        {
            Participants = new HashSet<Participants>();
        }

        public string Nom { get; set; }
        public string Email { get; set; }
        public string Telephone { get; set; }
        public string Adresse { get; set; }
        public virtual ICollection<Participants> Participants { get; set; }
    }
}
