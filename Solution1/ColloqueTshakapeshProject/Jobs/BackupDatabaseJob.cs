using ColloqueTshakapeshProject.Filters;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace ColloqueTshakapeshProject.Jobs
{
    public class BackupDatabaseJob : IJob
    {
        private readonly ILogger<BackupDatabaseJob> _logger;
        private readonly IConfiguration _configuration;

        public BackupDatabaseJob(ILogger<BackupDatabaseJob> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        [LogEverything]
        public async Task ExecuteAsync()
        {
            _logger.LogInformation($"backup started");

            string destination = _configuration["Jobs:BackupDatabase:DestinationFolder"];

            using (var sourceDB = new SqliteConnection(_configuration.GetConnectionString("DefaultConnection")))
            using (var destinationDB = new SqliteConnection($"Data Source={destination}backup-{DateTime.Now:yyyyMMddHHmmss}.db;"))
            {
                await sourceDB.OpenAsync();
                await destinationDB.OpenAsync();

                sourceDB.BackupDatabase(destinationDB);
            }

            _logger.LogInformation($"backup ended");
        }
    }
}
