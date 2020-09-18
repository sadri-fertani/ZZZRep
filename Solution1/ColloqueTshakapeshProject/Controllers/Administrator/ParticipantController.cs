using AutoMapper;
using ColloqueTshakapeshProject.Data;
using ColloqueTshakapeshProject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ColloqueTshakapeshProject.Controllers.Administrator
{
    [ApiController]
    [Route("api/Administrator/[controller]")]
    public class ParticipantController : ControllerBase
    {
        private readonly LinkGenerator _linkGenerator;
        private readonly ILogger<ParticipantController> _logger;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _uow;

        public ParticipantController(
            LinkGenerator linkGenerator,
            ILogger<ParticipantController> logger,
            IMapper mapper,
            IUnitOfWork uow)
        {
            _linkGenerator = linkGenerator;
            _logger = logger;
            _mapper = mapper;
            _uow = uow;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ParticipantModel>> GetOne(int id)
        {
            try
            {
                var participant = await _uow.GetRepository<Participants>().GetAsync(id);
                if (participant == null) return NotFound($"Participant {id} introuvable");

                return _mapper.Map<ParticipantModel>(participant);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error Participant-get-one {id} : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet()]
        public async Task<ActionResult<List<ParticipantModel>>> GetAll()
        {
            try
            {
                var Participant = await _uow.GetRepository<Participants>().GetAsync();
                if (Participant == null) return NotFound($"Aucune Participant trouvée");

                return _mapper.Map<List<ParticipantModel>>(Participant);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error Participant-get-all : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [Authorize]
        [HttpPost()]
        public async Task<ActionResult<ParticipantModel>> Post(ParticipantModel model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.Nom)) return BadRequest("Le nom de le Participant est obligatoire.");

                var participant = _mapper.Map<Participants>(model);

                _uow.GetRepository<Participants>().Add(participant);
                await _uow.CommitAsync();

                if (participant.Id != 0)
                {
                    var url = _linkGenerator.GetPathByAction(HttpContext,
                      "Get",
                      values: new { id = participant.Id });

                    return Created(url, _mapper.Map<ParticipantModel>(participant));
                }
                else
                {
                    _logger.LogWarning($"Erreur lors de l'ajout de le Participant: {participant.Nom}");

                    return BadRequest("Erreur lors de l'ajout de le Participant.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error Participant-post-one : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [Authorize]
        [HttpPut()]
        public async Task<ActionResult<ParticipantModel>> Put(ParticipantModel model)
        {
            try
            {
                var participant = await _uow.GetRepository<Participants>().GetAsync(model.Id);
                if (participant == null) return NotFound($"Participant {model.Id} introuvable");

                if (string.IsNullOrWhiteSpace(model.Nom)) return BadRequest("Le nom de le Participant est obligatoire.");

                var updatedParticipant = _mapper.Map<Participants>(model);

                _uow.GetRepository<Participants>().Update(updatedParticipant);
                await _uow.CommitAsync();

                var url = _linkGenerator.GetPathByAction(HttpContext,
                      "Get",
                      values: new { id = participant.Id });

                return Created(url, _mapper.Map<ParticipantModel>(updatedParticipant));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error Participant-post-one : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ParticipantModel>> Delete(int id)
        {
            try
            {
                var participant = await _uow.GetRepository<Participants>().GetAsync(id);
                if (participant == null) return StatusCode(StatusCodes.Status204NoContent);


                _uow.GetRepository<Participants>().Update(participant);
                await _uow.CommitAsync();

                return StatusCode(StatusCodes.Status200OK);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error Participant-post-one : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}