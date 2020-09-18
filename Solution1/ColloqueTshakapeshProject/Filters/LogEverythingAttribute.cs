using Hangfire.Client;
using Hangfire.Common;
using Hangfire.Logging;
using Hangfire.Server;
using Hangfire.States;
using Hangfire.Storage;

namespace ColloqueTshakapeshProject.Filters
{
    public class LogEverythingAttribute : JobFilterAttribute, IClientFilter, IServerFilter, IElectStateFilter, IApplyStateFilter
    {
        private static readonly ILog Logger = LogProvider.GetCurrentClassLogger();

        public void OnCreating(CreatingContext filterContext)
        {
            Logger.InfoFormat($"Creating a job based on method `{filterContext.Job.Method.Name}`...");
        }

        public void OnCreated(CreatedContext filterContext)
        {
            Logger.InfoFormat($"Job that is based on method `{filterContext.Job.Method.Name}` has been created with id `{filterContext.BackgroundJob?.Id}`");
        }

        public void OnPerforming(PerformingContext filterContext)
        {
            Logger.InfoFormat($"Starting to perform job `{filterContext.BackgroundJob.Id}`");
        }

        public void OnPerformed(PerformedContext filterContext)
        {
            Logger.InfoFormat($"Job `{filterContext.BackgroundJob.Id}` has been performed");
        }

        public void OnStateElection(ElectStateContext context)
        {
            if (context.CandidateState is FailedState failedState)
                Logger.WarnFormat($"Job `{context.BackgroundJob.Id}` has been failed due to an exception `{failedState.Exception}`");
        }

        public void OnStateApplied(ApplyStateContext context, IWriteOnlyTransaction transaction)
        {
            Logger.InfoFormat($"Job `{context.BackgroundJob.Id}` state was changed from `{context.OldStateName}` to `{context.NewState.Name}`");
        }

        public void OnStateUnapplied(ApplyStateContext context, IWriteOnlyTransaction transaction)
        {
            Logger.InfoFormat($"Job `{context.BackgroundJob.Id}` state `{context.OldStateName}` was unapplied.");
        }
    }
}
