using System;

namespace ColloqueTshakapeshProject.Models
{
    public class Message
    {
        public int IdColloque { get; set; }
        public bool Booked { get; set; }
        public DateTime DateMessage { get; set; }
    }
}