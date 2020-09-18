using System;
using System.ComponentModel.DataAnnotations;

namespace ColloqueTshakapeshProject.Models
{
    public partial class EcoleModel
    {
        public int Id { get; set; }
        [Required]
        public string Nom { get; set; }
        public string Email { get; set; }
        public string Telephone { get; set; }
        [Required]
        public string Adresse { get; set; }

        public override bool Equals(object obj)
        {
            return (obj is EcoleModel extObj) && (
                    extObj.Nom.Equals(this.Nom)
                    && extObj.Adresse.Equals(this.Adresse)
                );
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }
    }
}
