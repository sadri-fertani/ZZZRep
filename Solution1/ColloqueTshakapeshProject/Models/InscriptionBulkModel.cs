using System.Collections.Generic;

namespace ColloqueTshakapeshProject.Models
{
    public class InscriptionBulkModel
    {
        public ParticipantModel Participant { get; set; }
        public List<ColloqueModel> Colloques { get; set; }
    }
}
