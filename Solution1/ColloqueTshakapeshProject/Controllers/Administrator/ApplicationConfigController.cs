using ColloqueTshakapeshProject.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.IO;

namespace ColloqueTshakapeshProject.Controllers.Administrator
{
    [Authorize]
    [Route("api/Administrator/[controller]")]
    [ApiController]
    public class ApplicationConfigController : ControllerBase
    {
        private readonly ILogger<ApplicationConfigController> _logger;
        protected ConfigModel _settings { get; set; }

        public ApplicationConfigController(
            ILogger<ApplicationConfigController> logger,
            IOptions<ConfigModel> settings)
        {
            _logger = logger;
            if (settings != null) _settings = settings.Value;
        }

        [HttpOptions("UpdateFlagRegisterAdmin/{allowRegister}")]
        public IActionResult UpdateFlagRegisterAdmin(bool allowRegister = false)
        {
            try
            {
                _settings.AllowRegister = allowRegister;

                FileStream fs = null;
                try
                {
                    fs = new FileStream("extrasettings.json", FileMode.Create);
                    
                    using (StreamWriter file = new StreamWriter(fs))
                    {
                        fs = null;

                        JsonSerializer serializer = new JsonSerializer() { Formatting = Formatting.Indented };
                        serializer.Serialize(file, new { Config = _settings });
                    }
                }
                finally
                {
                    fs?.Dispose();
                }

                return StatusCode(StatusCodes.Status202Accepted);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public ActionResult<bool> GetFlagRegisterAdmin()
        {
            try
            {
                return _settings.AllowRegister;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error get-flag-register-admin : {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}