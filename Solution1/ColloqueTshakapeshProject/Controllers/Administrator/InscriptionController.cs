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
    public class InscriptionController : ControllerBase
    {
        private readonly LinkGenerator _linkGenerator;
        private readonly ILogger<InscriptionController> _logger;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _uow;

        public InscriptionController(
            LinkGenerator linkGenerator,
            ILogger<InscriptionController> logger,
            IMapper mapper,
            IUnitOfWork uow)
        {
            _linkGenerator = linkGenerator;
            _logger = logger;
            _mapper = mapper;
            _uow = uow;
        }
        [HttpGet("{id:int}")]
        public async Task<ActionResult<InscriptionModel>> GetOne(int id)
        {
            try
            {
                var inscription = await _uow.GetRepository<Inscriptions>().GetAsync(id);
                if (inscription == null) return NotFound($"Inscription {id} introuvable");

                return _mapper.Map<InscriptionModel>(inscription);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error inscription-get-one {id} : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet()]
        public async Task<ActionResult<List<InscriptionModel>>> GetAll()
        {
            try
            {
                var inscription = await _uow.GetRepository<Inscriptions>().GetAsync();
                if (inscription == null) return NotFound($"Aucune inscription trouvée");

                return _mapper.Map<List<InscriptionModel>>(inscription);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error inscription-get-all : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [Authorize]
        [HttpPost()]
        public async Task<ActionResult<InscriptionModel>> Post(InscriptionModel model)
        {
            try
            {
                var inscription = _mapper.Map<Inscriptions>(model);

                _uow.GetRepository<Inscriptions>().Add(inscription);
                await _uow.CommitAsync();

                if (inscription.Id != 0)
                {
                    var url = _linkGenerator.GetPathByAction(HttpContext,
                      "Get",
                      values: new { id = inscription.Id });

                    return Created(url, _mapper.Map<InscriptionModel>(inscription));
                }
                else
                {
                    _logger.LogWarning($"Erreur lors de l'ajout de l'inscription: {inscription.Guid}");

                    return BadRequest("Erreur lors de l'ajout de l'inscription.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error inscription-post-one : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<InscriptionModel>> Delete(int id)
        {
            try
            {
                var inscription = await _uow.GetRepository<Inscriptions>().GetAsync(id);
                if (inscription == null) return StatusCode(StatusCodes.Status204NoContent);

                // Suppression logique

                _uow.GetRepository<Inscriptions>().Delete(inscription);
                await _uow.CommitAsync();

                return StatusCode(StatusCodes.Status200OK);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error inscription-post-one : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}