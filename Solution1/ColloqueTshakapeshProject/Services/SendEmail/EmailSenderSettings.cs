﻿namespace ColloqueTshakapeshProject.Services
{
    public class EmailSenderSettings
    {
        public string EmailFrom { get; set; }
        public string NameFrom { get; set; }
        public string EmailSubject { get; set; }
        public string SmtpServer { get; set; }
        public int SmtpPort { get; set; }
        public string LoginSmtpServer { get; set; }
        public string PasswordSmtpServer { get; set; }
    }
}