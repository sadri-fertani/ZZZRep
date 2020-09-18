using ColloqueTshakapeshProject.Data;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace ColloqueTshakapeshProject.Utility
{
    public static class TemplateGenerator
    {
        public static string GetCssString()
        {
            var cssString = string.Empty;

            using (var fileStream = new FileStream(Path.Combine(Directory.GetCurrentDirectory(), @"assets\css\StyleEmail.css"), FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
            using (var textReader = new StreamReader(fileStream))
            {
                cssString = textReader.ReadToEnd();
            }

            return cssString;
        }

        public static string GetHtmlString(Participants participant, string urlBaseUpdateSubscription, bool includeCss = false, string guid = "")
        {
            // Application du filtre unitaire
            if (guid.Length != 0)
            {
                participant.Inscriptions = new List<Inscriptions>() { participant.Inscriptions.First(i => i.Guid == guid) };
            }

            var sb = new StringBuilder();

            sb.AppendFormat(@"
                        <html>
                            <head>
                                {0}
                            </head>
                            <body>
                                <div class='header'><h1>Colloque Tshakapesh</h1></div>
                                <p>Bonjour {1} {2},</p>
                                <p>{3}</p>
                                <table style=""align-content:'center'"">
                                    <tr>
                                        <th>Colloque</th>
                                        <th>Lieu</th>
                                        <th>Date</th>
                                        <th>Durée (minutes)</th>
                                        <th>Guid</th>
                                    </tr>",
                                    includeCss ? string.Format("<style>{0}</style>", GetCssString()) : string.Empty,
                                    participant.Prenom[0].ToString().ToUpper() + participant.Prenom.Substring(1).ToLower(),
                                    participant.Nom.ToUpper(),
                                    participant.Inscriptions.Count > 1 ? "Voici la liste de vos inscriptions" : "Voici votre inscription");

            foreach (var inscription in participant.Inscriptions)
            {
                sb.AppendFormat(@"<tr>
                                    <td>{0}</td>
                                    <td>{1}</td>
                                    <td>{2}</td>
                                    <td>{3}</td>
                                    <td>{4}</td>
                                  </tr>",
                                  inscription.Colloque.Titre,
                                  inscription.Colloque.Emplacement,
                                  inscription.Colloque.DateColloque.ToString("dd MMMM yyyy HH:mm"),
                                  inscription.Colloque.DureeColloque,
                                  inscription.Guid);
            }

            sb.AppendFormat(@"</table>
                    <br />
                    <p>Pour modifier votre inscription, veuillez suivre <a href=""{0}"" target=""_blank"">ce lien</a>.</p>
                </body>
            </html>", urlBaseUpdateSubscription + participant.Inscriptions.First().Guid);

            return sb.ToString();
        }
    }
}
