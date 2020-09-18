using System.Threading.Tasks;

namespace ColloqueTshakapeshProject.Services
{
    public interface IEmailSender
    {
        Task SendEmail(string email, string toUsername = "Participant", string messageHTML = "Confirmation d'inscription");
    }
}
