using ColloqueTshakapeshProject.Data;
using ColloqueTshakapeshProject.Utility;
using DinkToPdf;
using DinkToPdf.Contracts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ColloqueTshakapeshProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PdfCreatorController : ControllerBase
    {
        private readonly IConverter _converter;
        private readonly IMemoryCache _memoryCache;
        private readonly ILogger<PdfCreatorController> _logger;
        private readonly IUnitOfWork _uow;

        private string _urlBaseUpdateSubscription => this.Request.IsHttps ? $"https://{this.Request.Host}/home/inscription/" : $"http://{this.Request.Host}/home/inscription/";

        public PdfCreatorController(
            IConverter converter,
            IMemoryCache memoryCache,
            ILogger<PdfCreatorController> logger,
            IUnitOfWork uow)
        {
            _converter = converter;
            _memoryCache = memoryCache;
            _logger = logger;
            _uow = uow;
        }

        [HttpGet("PdfAll/{guid}")]
        public async Task<FileStreamResult> CreatePdfSync(string guid)
        {
            _logger.LogInformation("Begin create pdf");

            var currentInscription = (await _uow.GetRepository<Inscriptions>().GetAsync(i => i.Guid == guid)).FirstOrDefault();
            if (currentInscription == null) throw new ArgumentException("Aucune inscription trouvée");

            string bodyHtml = TemplateGenerator.GetHtmlString(currentInscription.Participant, _urlBaseUpdateSubscription, false);

            _logger.LogError("Content of pdf saved into MemoryCache.");

            var globalSettings = new GlobalSettings
            {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Portrait,
                PaperSize = PaperKind.A4,
                Margins = new MarginSettings { Top = 10 },
                DocumentTitle = "PDF Report"
            };

            var objectSettings = new ObjectSettings
            {
                PagesCount = true,
                HtmlContent = bodyHtml,    // Convert HTML string to PDF
                WebSettings = { DefaultEncoding = "utf-8", UserStyleSheet = Path.Combine(Directory.GetCurrentDirectory(), "assets", "css", "stylePdf.css") },
                HeaderSettings = { FontName = "Arial", FontSize = 9, Right = "Page [page] of [toPage]", Line = true },
                FooterSettings = { FontName = "Arial", FontSize = 9, Line = true, Center = "Report Footer" }
            };

            var pdf = new HtmlToPdfDocument()
            {
                GlobalSettings = globalSettings,
                Objects = { objectSettings }
            };

            //Saving the PDF to the MemoryStream
            var stream = new MemoryStream(_converter.Convert(pdf));

            _logger.LogInformation("End create pdf");

            //Download the PDF document in the browser
            return await Task.FromResult<FileStreamResult>(new FileStreamResult(stream, "application/pdf")
            {
                FileDownloadName = $"inscriptions-{currentInscription.Participant.Prenom}-{currentInscription.Participant.Nom}.pdf"
            });
        }

        [HttpGet("PdfOne/{guid}")]
        public async Task<FileStreamResult> CreateOnePdfSync(string guid)
        {
            _logger.LogInformation("Begin create pdf-one");

            // Look for cache key.
            if (_memoryCache.TryGetValue($"pdf-html-{guid}", out string bodyHtml))
            {
                _logger.LogError("Content of pdf loaded from MemoryCache.");
            }
            else
            {
                var currentInscription = (await _uow.GetRepository<Inscriptions>().GetAsync(i => i.Guid == guid)).FirstOrDefault();
                if (currentInscription == null) throw new ArgumentException("Aucune inscription trouvée");

                bodyHtml = TemplateGenerator.GetHtmlString(currentInscription.Participant, _urlBaseUpdateSubscription, false, guid);

                // Save data in cache.
                _memoryCache.Set(
                    $"pdf-html-{guid}",
                    bodyHtml,
                    new MemoryCacheEntryOptions
                    {
                        AbsoluteExpiration = DateTime.Now.AddMinutes(30),
                        Priority = CacheItemPriority.Normal
                    }
                );

                _logger.LogError("Content of pdf saved into MemoryCache.");
            }

            var globalSettings = new GlobalSettings
            {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Portrait,
                PaperSize = PaperKind.A4,
                Margins = new MarginSettings { Top = 10 },
                DocumentTitle = "PDF Report"
            };

            var objectSettings = new ObjectSettings
            {
                PagesCount = true,
                HtmlContent = bodyHtml,    // Convert HTML string to PDF
                WebSettings = { DefaultEncoding = "utf-8", UserStyleSheet = Path.Combine(Directory.GetCurrentDirectory(), "assets", "css", "stylePdf.css") },
                HeaderSettings = { FontName = "Arial", FontSize = 9, Right = "Page [page] of [toPage]", Line = true },
                FooterSettings = { FontName = "Arial", FontSize = 9, Line = true, Right = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") }
            };

            var pdf = new HtmlToPdfDocument()
            {
                GlobalSettings = globalSettings,
                Objects = { objectSettings }
            };

            //Saving the PDF to the MemoryStream
            var stream = new MemoryStream(_converter.Convert(pdf));

            _logger.LogInformation("End create pdf");

            //Download the PDF document in the browser
            return await Task.FromResult<FileStreamResult>(new FileStreamResult(stream, "application/pdf")
            {
                FileDownloadName = $"inscription-{guid}.pdf"
            });
        }
    }
}