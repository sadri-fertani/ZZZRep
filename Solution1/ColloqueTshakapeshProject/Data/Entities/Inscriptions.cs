using System;

namespace ColloqueTshakapeshProject.Data
{
    public partial class Inscriptions
    {
        public int ColloqueId { get; set; }
        public int ParticipantId { get; set; }
        public string Guid { get; set; }
        public DateTime DateCreation { get; set; }
        public virtual Colloques Colloque { get; set; }
        public virtual Participants Participant { get; set; }
    }
}
