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
    public class EcoleController : ControllerBase
    {
        private readonly LinkGenerator _linkGenerator;
        private readonly ILogger<EcoleController> _logger;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _uow;

        public EcoleController(
            LinkGenerator linkGenerator,
            ILogger<EcoleController> logger,
            IMapper mapper,
            IUnitOfWork uow)
        {
            _linkGenerator = linkGenerator;
            _logger = logger;
            _mapper = mapper;
            _uow = uow;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<EcoleModel>> GetOne(int id)
        {
            try
            {
                var ecole = await _uow.GetRepository<Ecoles>().GetAsync(id);
                if (ecole == null) return NotFound($"Ecole {id} introuvable");

                return _mapper.Map<EcoleModel>(ecole);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error ecole-get-one {id.ToString()} : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet()]
        public async Task<ActionResult<List<EcoleModel>>> GetAll()
        {
            try
            {
                var ecole = await _uow.GetRepository<Ecoles>().GetAsync();
                if (ecole == null) return NotFound($"Aucune école trouvée");

                return _mapper.Map<List<EcoleModel>>(ecole);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error ecole-get-all : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [Authorize]
        [HttpPost()]
        public async Task<ActionResult<EcoleModel>> Post(EcoleModel model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.Nom)) return BadRequest("Le nom de l'école est obligatoire.");
                if (string.IsNullOrWhiteSpace(model.Adresse)) return BadRequest("L'adresse de l'école est obligatoire.");

                var ecole = _mapper.Map<Ecoles>(model);

                _uow.GetRepository<Ecoles>().Add(ecole);
                await _uow.CommitAsync();

                if (ecole.Id != 0)
                {
                    var url = _linkGenerator.GetPathByAction(HttpContext,
                      "Get",
                      values: new { id = ecole.Id });

                    return Created(url, _mapper.Map<EcoleModel>(ecole));
                }
                else
                {
                    _logger.LogWarning($"Erreur lors de l'ajout de l'école: {ecole.Nom}");

                    return BadRequest("Erreur lors de l'ajout de l'école.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error ecole-post-one : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [Authorize]
        [HttpPut()]
        public async Task<ActionResult<EcoleModel>> Put(EcoleModel model)
        {
            try
            {
                var ecole = await _uow.GetRepository<Ecoles>().GetAsync(model.Id);
                if (ecole == null) return NotFound($"Ecole {model.Id} introuvable");

                if (string.IsNullOrWhiteSpace(model.Nom)) return BadRequest("Le nom de l'école est obligatoire.");
                if (string.IsNullOrWhiteSpace(model.Adresse)) return BadRequest("L'adresse de l'école est obligatoire.");

                var updatedEcole = _mapper.Map<Ecoles>(model);

                _uow.GetRepository<Ecoles>().Update(updatedEcole);
                await _uow.CommitAsync();

                var url = _linkGenerator.GetPathByAction(HttpContext,
                      "Get",
                      values: new { id = ecole.Id });

                return Created(url, _mapper.Map<EcoleModel>(updatedEcole));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error ecole-post-one : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<EcoleModel>> Delete(int id)
        {
            try
            {
                var ecole = await _uow.GetRepository<Ecoles>().GetAsync(id);
                if (ecole == null) return StatusCode(StatusCodes.Status204NoContent);

                _uow.GetRepository<Ecoles>().Delete(ecole);
                await _uow.CommitAsync();

                return StatusCode(StatusCodes.Status200OK);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error ecole-post-one : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
