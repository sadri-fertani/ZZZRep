using System;
using System.Collections.Generic;

namespace ColloqueTshakapeshProject.Data
{
    public partial class Colloques
    {
        public Colloques()
        {
            Inscriptions = new HashSet<Inscriptions>();
        }

        public string Titre { get; set; }
        public string Description { get; set; }
        public string Emplacement { get; set; }
        public int TypeId { get; set; }
        public decimal Cout { get; set; }
        public int NombreParticipantMax { get; set; }
        public string Responsable { get; set; }
        public int DureeColloque { get; set; }
        public DateTime DateColloque { get; set; }
        public virtual TypeColloque Type { get; set; }
        public virtual ICollection<Inscriptions> Inscriptions { get; set; }
    }
}
