using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ColloqueTshakapeshProject.Models
{
    public partial class ColloqueModel
    {
        public int Id { get; set; }
        [Required]
        public string Titre { get; set; }
        public string Description { get; set; }
        [Required]
        public int TypeId { get; set; }
        public string TypeName { get; set; }
        [Required]
        public decimal? Cout { get; set; }
        public string Responsable { get; set; }
        [Required]
        public string Emplacement { get; set; }
        [Required]
        public int NombreParticipantMax { get; set; }
        [Required]
        public int DureeColloque { get; set; }
        [Required]
        public DateTime DateColloque { get; set; }
        public List<InscriptionModel> Inscriptions { get; set; }
    }
}

