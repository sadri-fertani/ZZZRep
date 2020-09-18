using Microsoft.AspNetCore.Hosting;

[assembly: HostingStartup(typeof(ColloqueTshakapeshProject.Areas.Identity.IdentityHostingStartup))]
namespace ColloqueTshakapeshProject.Areas.Identity
{
    public class IdentityHostingStartup : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder)
        {
            builder.ConfigureServices((context, services) =>
            {
            });
        }
    }
}