using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace ColloqueTshakapeshProject.Services
{
    public class CustomConfigManager : ICustomConfigManager
    {
        private readonly ILogger<ICustomConfigManager> _logger;
        private readonly IConfiguration _configuration;
        protected ConfigModel mySettings { get; set; }

        public CustomConfigManager(
            ILogger<ICustomConfigManager> logger,
            IConfiguration configuration,
            IOptions<ConfigModel> settings)
        {
            _logger = logger;
            _configuration = configuration;
            if (settings != null) mySettings = settings.Value;
        }

        public bool IsAllowRegister()
        {
            return mySettings.AllowRegister;
        }
    }
}
