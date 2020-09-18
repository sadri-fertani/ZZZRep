using System.ComponentModel.DataAnnotations;

namespace ColloqueTshakapeshProject.Models
{
    public class FonctionModel
    {
        public int Id { get; set; }
        [Required]
        public string Nom { get; set; }

    }
}
