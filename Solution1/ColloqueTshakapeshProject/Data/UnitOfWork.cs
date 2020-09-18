using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ColloqueTshakapeshProject.Data
{
    public class UnitOfWork : IUnitOfWork<ColloqueTshakapeshDbContext>
    {
        public ColloqueTshakapeshDbContext _context { get; }
        private readonly Dictionary<Type, object> _repositories;
        private bool _disposed;

        public UnitOfWork(ColloqueTshakapeshDbContext context)
        {
            _context = context;
            _disposed = false;
            _repositories = new Dictionary<Type, object>();
        }

        public async Task<int> CommitAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public IRepository<T> GetRepository<T>() where T : TEntity
        {
            // Checks if the Dictionary Key contains the Model class
            if (_repositories.Keys.Contains(typeof(T)))
            {
                // Return the repository for that Model class
                return _repositories[typeof(T)] as IRepository<T>;
            }

            // If the repository for that Model class doesn't exist, create it
            var repository = new Repository<T>(this);

            // Add it to the dictionary
            _repositories.Add(typeof(T), repository);

            return repository;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (_disposed) return;

            if (disposing)
            {
                _context.Dispose();
            }

            _disposed = true;
        }
    }
}
