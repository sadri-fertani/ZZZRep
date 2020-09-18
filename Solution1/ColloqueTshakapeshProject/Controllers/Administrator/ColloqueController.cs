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
    public class ColloqueController : ControllerBase
    {
        private readonly LinkGenerator _linkGenerator;
        private readonly ILogger<ColloqueController> _logger;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _uow;

        public ColloqueController(
            LinkGenerator linkGenerator,
            ILogger<ColloqueController> logger,
            IMapper mapper,
            IUnitOfWork uow)
        {
            _linkGenerator = linkGenerator;
            _logger = logger;
            _mapper = mapper;
            _uow = uow;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ColloqueModel>> GetOne(int id)
        {
            try
            {
                var colloque = await _uow.GetRepository<Colloques>().GetAsync(id);

                if (colloque == null) return NotFound($"Colloque {id} introuvable");

                return _mapper.Map<ColloqueModel>(colloque);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error colloque-get-one {id.ToString()} : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet()]
        public async Task<ActionResult<List<ColloqueModel>>> GetAll()
        {
            try
            {
                var colloques = await _uow.GetRepository<Colloques>().GetAsync();
                if (colloques == null) return NotFound($"Aucune colloque trouvée");

                return _mapper.Map<List<ColloqueModel>>(colloques);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error colloque-get-all : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [Authorize]
        [HttpPost()]
        public async Task<ActionResult<ColloqueModel>> Post(ColloqueModel model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.Titre)) return BadRequest("Le titre de la colloque est obligatoire.");
                if (string.IsNullOrWhiteSpace(model.Emplacement)) return BadRequest("L'emplacement de la colloque est obligatoire.");
                if (model.TypeId == 0) return BadRequest("Le type de la colloque est obligatoire.");
                if (model.NombreParticipantMax == 0) return BadRequest("Le nombre de participants maximum de la colloque est obligatoire.");
                if (model.DateColloque.Equals(DateTime.MinValue)) return BadRequest("La date de la colloque est obligatoire.");
                if (model.DureeColloque == 0) return BadRequest("La durée de la colloque est obligatoire.");
                if (!model.Cout.HasValue) return BadRequest("Le coût de participation à la colloque est obligatoire.");

                var colloque = _mapper.Map<Colloques>(model);

                _uow.GetRepository<Colloques>().Add(colloque);
                await _uow.CommitAsync();

                if (colloque.Id != 0)
                {
                    var url = _linkGenerator.GetPathByAction(HttpContext,
                      "Get",
                      values: new { id = colloque.Id });

                    return Created(url, _mapper.Map<ColloqueModel>(colloque));
                }
                else
                {
                    _logger.LogWarning($"Erreur lors de l'ajout de la colloque: {colloque.Titre}");

                    return BadRequest("Erreur lors de l'ajout de la colloque.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error colloque-post-one : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [Authorize]
        [HttpPut()]
        public async Task<ActionResult<ColloqueModel>> Put(ColloqueModel model)
        {
            try
            {
                var colloque = await _uow.GetRepository<Colloques>().GetAsync(model.Id);
                if (colloque == null) return NotFound($"Colloque {model.Id} introuvable");

                if (string.IsNullOrWhiteSpace(model.Titre)) return BadRequest("Le titre de la colloque est obligatoire.");
                if (string.IsNullOrWhiteSpace(model.Emplacement)) return BadRequest("L'emplacement de la colloque est obligatoire.");
                if (model.TypeId == 0) return BadRequest("Le type de la colloque est obligatoire.");
                if (model.NombreParticipantMax == 0) return BadRequest("Le nombre de participants maximum de la colloque est obligatoire.");
                if (model.DateColloque.Equals(DateTime.MinValue)) return BadRequest("La date de la colloque est obligatoire.");
                if (model.DureeColloque == 0) return BadRequest("La durée de la colloque est obligatoire.");
                if (!model.Cout.HasValue) return BadRequest("Le coût de participation à la colloque est obligatoire.");

                var updatedColloque = _mapper.Map<Colloques>(model);

                _uow.GetRepository<Colloques>().Update(updatedColloque);
                await _uow.CommitAsync();

                var url = _linkGenerator.GetPathByAction(HttpContext,
                      "Get",
                      values: new { id = colloque.Id });

                return Created(url, _mapper.Map<ColloqueModel>(updatedColloque));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error colloque-put : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ColloqueModel>> Delete(int id)
        {
            try
            {
                var colloque = await _uow.GetRepository<Colloques>().GetAsync(id);
                if (colloque == null) return StatusCode(StatusCodes.Status204NoContent);

                _uow.GetRepository<Colloques>().Delete(colloque);
                await _uow.CommitAsync();

                return StatusCode(StatusCodes.Status200OK);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error colloque-delete : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
