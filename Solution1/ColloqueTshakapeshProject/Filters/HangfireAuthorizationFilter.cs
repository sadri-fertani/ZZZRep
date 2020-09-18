using Hangfire.Dashboard;

namespace ColloqueTshakapeshProject.Filters
{
    public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize(DashboardContext context)
        {
            return !string.IsNullOrWhiteSpace(
                context.GetHttpContext().Request.Cookies[".AspNetCore.Identity.Application"]
                );
        }
    }
}