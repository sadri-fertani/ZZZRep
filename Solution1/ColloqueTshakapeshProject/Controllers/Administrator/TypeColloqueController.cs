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
    [Route("api/Administrator/[controller]")]
    [ApiController]
    public class TypeColloqueController : ControllerBase
    {
        private readonly LinkGenerator _linkGenerator;

        private readonly ILogger<TypeColloqueController> _logger;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _uow;

        public TypeColloqueController(
            LinkGenerator linkGenerator,
            ILogger<TypeColloqueController> logger,
            IMapper mapper,
            IUnitOfWork uow)
        {
            _linkGenerator = linkGenerator;
            _logger = logger;
            _mapper = mapper;
            _uow = uow;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<TypeColloqueModel>> GetOne(int id)
        {
            try
            {
                var function = await _uow.GetRepository<TypeColloque>().GetAsync(id);
                if (function == null) return NotFound($"TypeColloque {id} introuvable");

                return _mapper.Map<TypeColloqueModel>(function);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error typeColloque-get-one {id.ToString()} : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet()]
        public async Task<ActionResult<List<TypeColloqueModel>>> GetAll()
        {
            try
            {
                var typeColloque = await _uow.GetRepository<TypeColloque>().GetAsync();
                if (typeColloque == null) return NotFound($"Aucune typeColloque trouvée");

                return _mapper.Map<List<TypeColloqueModel>>(typeColloque);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error typeColloque-get-all : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [Authorize]
        [HttpPost()]
        public async Task<ActionResult<TypeColloqueModel>> Post(TypeColloqueModel model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.Nom)) return BadRequest("Le nom de la typeColloque est obligatoire.");

                var typeColloque = _mapper.Map<TypeColloque>(model);

                _uow.GetRepository<TypeColloque>().Add(typeColloque);
                await _uow.CommitAsync();

                if (typeColloque.Id != 0)
                {
                    var url = _linkGenerator.GetPathByAction(HttpContext,
                      "Get",
                      values: new { id = typeColloque.Id });

                    return Created(url, _mapper.Map<TypeColloqueModel>(typeColloque));
                }
                else
                {
                    _logger.LogWarning($"Erreur lors de l'ajout de la typeColloque: {typeColloque.Nom}");

                    return BadRequest("Erreur lors de l'ajout de la typeColloque.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error typeColloque-post-one : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [Authorize]
        [HttpPut()]
        public async Task<ActionResult<TypeColloqueModel>> Put(TypeColloqueModel model)
        {
            try
            {
                var typeColloque = await _uow.GetRepository<TypeColloque>().GetAsync(model.Id);
                if (typeColloque == null) return NotFound($"TypeColloque {model.Id} introuvable");

                if (string.IsNullOrWhiteSpace(model.Nom)) return BadRequest("Le nom de la typeColloque est obligatoire.");

                var updatedTypeColloque = _mapper.Map<TypeColloque>(model);

                _uow.GetRepository<TypeColloque>().Update(updatedTypeColloque);
                await _uow.CommitAsync();

                var url = _linkGenerator.GetPathByAction(HttpContext,
                      "Get",
                      values: new { id = typeColloque.Id });

                return Created(url, _mapper.Map<TypeColloqueModel>(updatedTypeColloque));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error typeColloque-post-one : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<TypeColloqueModel>> Delete(int id)
        {
            try
            {
                var typeColloque = await _uow.GetRepository<TypeColloque>().GetAsync(id);
                if (typeColloque == null) return StatusCode(StatusCodes.Status204NoContent);

                _uow.GetRepository<TypeColloque>().Delete(typeColloque);
                await _uow.CommitAsync();

                return StatusCode(StatusCodes.Status200OK);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error typeColloque-post-one : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}