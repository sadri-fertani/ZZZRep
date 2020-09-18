﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace ColloqueTshakapeshProject.Data
{
    public class Repository<T> : IRepository<T> where T : TEntity
    {
        private readonly IUnitOfWork<ColloqueTshakapeshDbContext> _unitOfWork;

        public Repository(IUnitOfWork<ColloqueTshakapeshDbContext> unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<T> GetAsync(int id)
        {
            var query = _unitOfWork._context.Set<T>().AsQueryable();
            IncludeChildren(ref query);

            return await query.FirstOrDefaultAsync<T>(x => x.Id == id);
        }

        public async Task<IEnumerable<T>> GetAsync()
        {
            var query = _unitOfWork._context.Set<T>().AsQueryable();
            IncludeChildren(ref query);

            return await query.ToArrayAsync<T>();
        }

        public async Task<IEnumerable<T>> GetAsync(Expression<Func<T, bool>> predicate)
        {
            var query = _unitOfWork._context.Set<T>().AsQueryable();
            IncludeChildren(ref query);

            return await query.Where(predicate).ToArrayAsync<T>();
        }

        public void Add(T entity)
        {
            _unitOfWork._context.Set<T>().Add(entity);
        }

        public void Delete(T entity)
        {
            T existing = _unitOfWork._context.Set<T>().Find(entity.Id);
            if (existing != null) _unitOfWork._context.Set<T>().Remove(existing);
        }

        public void Update(T entity)
        {
            T existing = _unitOfWork._context.Set<T>().Find(entity.Id);

            if (existing != null)
            {
                _unitOfWork._context.Entry(existing).State = EntityState.Modified;
                _unitOfWork._context.Entry(existing).CurrentValues.SetValues(entity);
            }
        }

        private void IncludeChildren(ref IQueryable<T> query)
        {
            foreach (var property in _unitOfWork._context.Model.FindEntityType(typeof(T)).GetNavigations())
                query = query.Include(property.Name);
        }


    }
}
