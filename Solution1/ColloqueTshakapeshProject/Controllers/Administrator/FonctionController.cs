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
    public class FonctionController : ControllerBase
    {
        private readonly LinkGenerator _linkGenerator;

        private readonly ILogger<FonctionController> _logger;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _uow;


        public FonctionController(
            ILogger<FonctionController> logger,
            IMapper mapper,
            IUnitOfWork uow,
            LinkGenerator linkGenerator)
        {
            _linkGenerator = linkGenerator;
            _logger = logger;
            _mapper = mapper;
            _uow = uow;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<FonctionModel>> GetOne(int id)
        {
            try
            {
                var function = await _uow.GetRepository<Fonctions>().GetAsync(id);
                if (function == null) return NotFound($"Fonction {id} introuvable");

                return _mapper.Map<FonctionModel>(function);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fonction-get-one {id.ToString()} : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet()]
        public async Task<ActionResult<List<FonctionModel>>> GetAll()
        {
            try
            {
                var fonction = await _uow.GetRepository<Fonctions>().GetAsync();
                if (fonction == null) return NotFound($"Aucune fonction trouvée");

                return _mapper.Map<List<FonctionModel>>(fonction);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fonction-get-all : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [Authorize]
        [HttpPost()]
        public async Task<ActionResult<FonctionModel>> Post(FonctionModel model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.Nom)) return BadRequest("Le nom de la fonction est obligatoire.");

                var fonction = _mapper.Map<Fonctions>(model);

                _uow.GetRepository<Fonctions>().Add(fonction);
                await _uow.CommitAsync();

                if (fonction.Id != 0)
                {
                    var url = _linkGenerator.GetPathByAction(HttpContext,
                      "Get",
                      values: new { id = fonction.Id });

                    return Created(url, _mapper.Map<FonctionModel>(fonction));
                }
                else
                {
                    _logger.LogWarning($"Erreur lors de l'ajout de la fonction: {fonction.Nom}");

                    return BadRequest("Erreur lors de l'ajout de la fonction.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fonction-post-one : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [Authorize]
        [HttpPut()]
        public async Task<ActionResult<FonctionModel>> Put(FonctionModel model)
        {
            try
            {
                var fonction = await _uow.GetRepository<Fonctions>().GetAsync(model.Id);
                if (fonction == null) return NotFound($"Fonction {model.Id} introuvable");

                if (string.IsNullOrWhiteSpace(model.Nom)) return BadRequest("Le nom de la fonction est obligatoire.");

                var updatedFonction = _mapper.Map<Fonctions>(model);

                _uow.GetRepository<Fonctions>().Update(updatedFonction);
                await _uow.CommitAsync();

                var url = _linkGenerator.GetPathByAction(HttpContext,
                      "Get",
                      values: new { id = fonction.Id });

                return Created(url, _mapper.Map<FonctionModel>(updatedFonction));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fonction-post-one : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<FonctionModel>> Delete(int id)
        {
            try
            {
                var fonction = await _uow.GetRepository<Fonctions>().GetAsync(id);
                if (fonction == null) return StatusCode(StatusCodes.Status204NoContent);

                _uow.GetRepository<Fonctions>().Delete(fonction);
                await _uow.CommitAsync();

                return StatusCode(StatusCodes.Status200OK);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fonction-post-one : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

    }
}