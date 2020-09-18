using System.Collections.Generic;

namespace ColloqueTshakapeshProject.Data
{
    public partial class TypeColloque
    {
        public TypeColloque()
        {
            Colloques = new HashSet<Colloques>();
        }

        public string Nom { get; set; }

        public virtual ICollection<Colloques> Colloques { get; set; }
    }
}
