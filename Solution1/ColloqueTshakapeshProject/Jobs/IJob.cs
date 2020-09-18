using System.Threading.Tasks;

namespace ColloqueTshakapeshProject.Jobs
{
    public interface IJob
    {
        Task ExecuteAsync();
    }
}
