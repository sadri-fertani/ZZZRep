import { Observable } from "rxjs";

export interface IRepositoryBase<TEntity> {
    find(id: string | number): Observable<TEntity>;
    findAll(): Observable<Array<TEntity>>;
    create(entity: TEntity): Observable<TEntity>;
    update(entity: TEntity): Observable<TEntity>;    
    delete(id: string | number): Observable<TEntity>;
}