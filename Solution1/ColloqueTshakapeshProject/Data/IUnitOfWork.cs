using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace ColloqueTshakapeshProject.Data
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<T> GetRepository<T>() where T : TEntity;

        Task<int> CommitAsync();
    }

    public interface IUnitOfWork<out TContext> : IUnitOfWork where TContext : DbContext
    {
        TContext _context { get; }
    }
}
