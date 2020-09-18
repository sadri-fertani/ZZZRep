using System;

namespace ColloqueTshakapeshProject.Models
{
    public class InscriptionModel
    {
        public int Id { get; set; }
        public int ColloqueId { get; set; }
        public string ColloqueName { get; set; }
        public int ParticipantId { get; set; }
        public string ParticipantName { get; set; }
        public string ParticipantPrenom { get; set; }
        public string Guid { get; set; }
        public DateTime DateCreation { get; set; }
    }
}
