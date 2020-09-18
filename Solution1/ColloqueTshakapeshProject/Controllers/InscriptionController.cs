using AutoMapper;
using ColloqueTshakapeshProject.Data;
using ColloqueTshakapeshProject.Models;
using ColloqueTshakapeshProject.Services;
using ColloqueTshakapeshProject.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ColloqueTshakapeshProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InscriptionController : ControllerBase
    {
        private readonly ILogger<InscriptionController> _logger;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _uow;
        private readonly IEmailSender _emailSender;

        private string UrlBaseUpdateSubscription => this.Request.IsHttps ? $"https://{this.Request.Host}/home/inscription/" : $"http://{this.Request.Host}/home/inscription/";

        public InscriptionController(
            ILogger<InscriptionController> logger,
            IMapper mapper,
            IUnitOfWork uow,
            IEmailSender emailSender)
        {
            _logger = logger;
            _mapper = mapper;
            _uow = uow;
            _emailSender = emailSender;
        }

        [HttpGet("{guid}")]
        public async Task<ActionResult<List<InscriptionModel>>> GetAllFromGuidOfOne(string guid)
        {
            try
            {
                var currentInscription = await _uow.GetRepository<Inscriptions>().GetAsync(i => i.Guid == guid);
                if (!currentInscription.Any()) return NotFound($"Aucune inscription trouvée");

                var inscriptions = await _uow.GetRepository<Inscriptions>().GetAsync(i => i.ParticipantId == currentInscription.FirstOrDefault().ParticipantId);
                if (!inscriptions.Any()) return NotFound($"Aucune inscription trouvée");

                return _mapper.Map<List<InscriptionModel>>(inscriptions);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error inscription-get-all : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost()]
        public async Task<ActionResult<InscriptionBulkModel>> Post(InscriptionBulkModel model)
        {
            try
            {
                if (!model.Colloques.Any() || string.IsNullOrEmpty(model.Participant.Nom) || string.IsNullOrEmpty(model.Participant.Prenom)) return BadRequest("Le nom et le prénom du participant sont obligatoires, et il faut au moins une inscription.");

                var participant = _mapper.Map<Participants>(model.Participant);
                var colloques = _mapper.Map<List<Colloques>>(model.Colloques);

                _uow.GetRepository<Participants>().Add(participant);

                colloques.ForEach(colloque =>
                {
                    _uow.GetRepository<Inscriptions>().Add(
                        new Inscriptions()
                        {
                            Participant = participant,
                            ColloqueId = colloque.Id,
                            DateCreation = DateTime.Now,
                            Guid = Guid.NewGuid().ToString()
                        });
                });

                if (await _uow.CommitAsync() > 0)
                {
                    if (!string.IsNullOrEmpty(participant.Courriel))
                    {
                        foreach (var inscription in participant.Inscriptions)
                            inscription.Colloque = colloques.FirstOrDefault(c => c.Id == inscription.ColloqueId);

                        // Send email confirmation
                        await _emailSender.SendEmail(
                            participant.Courriel,
                            $"{participant.Prenom} {participant.Nom}",
                            TemplateGenerator.GetHtmlString(
                                participant,
                                this.UrlBaseUpdateSubscription,
                                true)
                            );
                    }

                    return StatusCode(StatusCodes.Status201Created, _mapper.Map<List<InscriptionModel>>(participant.Inscriptions));
                }
                else
                {
                    _logger.LogWarning($"Erreur lors de l'ajout des inscriptions");

                    return BadRequest("Erreur lors de l'ajout des inscriptions.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"inscription-post-bulk : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut()]
        public async Task<ActionResult<InscriptionBulkModel>> Put(InscriptionBulkModel model)
        {
            try
            {
                if (!model.Colloques.Any() || model.Participant.Id == 0) return BadRequest("Le participant est obligatoire, et il faut au moins une inscription.");

                var participant = await _uow.GetRepository<Participants>().GetAsync(model.Participant.Id);
                var colloques = _mapper.Map<List<Colloques>>(model.Colloques);

                // Inscriptions à supprimer
                participant.Inscriptions.Where(i => colloques.All(c => c.Id != i.ColloqueId)).ToList().ForEach(inscription =>
                {
                    _uow.GetRepository<Inscriptions>().Delete(inscription);
                });

                // Nouvelles inscriptions
                colloques.Where(c => participant.Inscriptions.All(i => i.ColloqueId != c.Id)).ToList().ForEach(colloque =>
                {
                    _uow.GetRepository<Inscriptions>().Add(
                           new Inscriptions()
                           {
                               Participant = participant,
                               ColloqueId = colloque.Id,
                               DateCreation = DateTime.Now,
                               Guid = Guid.NewGuid().ToString()
                           });
                });

                if (await _uow.CommitAsync() >= 0)
                {
                    if (!string.IsNullOrEmpty(participant.Courriel))
                    {
                        foreach (var inscription in participant.Inscriptions)
                            inscription.Colloque = colloques.FirstOrDefault(c => c.Id == inscription.ColloqueId);

                        // Send email confirmation
                        await _emailSender.SendEmail(
                            participant.Courriel,
                            $"{participant.Prenom} {participant.Nom}",
                            TemplateGenerator.GetHtmlString(
                                participant,
                                this.UrlBaseUpdateSubscription,
                                true)
                            );
                    }

                    return StatusCode(StatusCodes.Status201Created, _mapper.Map<List<InscriptionModel>>(participant.Inscriptions));
                }
                else
                {
                    _logger.LogWarning($"Erreur lors de la modification des inscriptions");

                    return BadRequest("Erreur lors de la modification des inscriptions.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error inscription-put-bulk : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

    }
}