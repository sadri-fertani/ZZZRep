using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using System.Threading.Tasks;

namespace ColloqueTshakapeshProject.Services
{
    public class EmailSender : IEmailSender
    {
        private EmailSenderSettings _settings { get; set; }

        public EmailSender(IOptions<EmailSenderSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task SendEmail(string email, string toUsername = "Participant", string messageHTML = "Confirmation d'inscription")
        {
            MimeMessage message = new MimeMessage();

            message.From.Add(new MailboxAddress(_settings.NameFrom, _settings.EmailFrom));
            message.To.Add(new MailboxAddress(toUsername, email));
            message.Subject = _settings.EmailSubject;

            BodyBuilder body = new BodyBuilder
            {
                HtmlBody = messageHTML
            };

            message.Body = body.ToMessageBody();

            SmtpClient client = new SmtpClient();
            client.Connect(_settings.SmtpServer, _settings.SmtpPort);
            await client.AuthenticateAsync(_settings.LoginSmtpServer, _settings.PasswordSmtpServer);

            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            client.Dispose();
        }
    }
}
