using System.ComponentModel.DataAnnotations;

namespace ColloqueTshakapeshProject.Models
{
    public class ParticipantModel
    {
        public int Id { get; set; }
        [Required]
        public string Nom { get; set; }
        [Required]
        public string Prenom { get; set; }
        public string Courriel { get; set; }
        public string Telephone { get; set; }
        public int? FonctionId { get; set; }
        public string FonctionName { get; set; }
        public int? EcoleId { get; set; }
        public string EcoleName { get; set; }
    }
}
