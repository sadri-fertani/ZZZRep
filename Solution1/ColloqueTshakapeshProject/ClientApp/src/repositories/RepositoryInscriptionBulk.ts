import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { IRepositoryBase } from './IRepositoryBase';

import { IInscriptionBulk } from 'src/models/IInscriptionBulk';

@Injectable()
export class RepositoryInscriptionBulk implements IRepositoryBase<IInscriptionBulk> {

    private get Route(): string {
        return this.baseUrl + 'api/Inscription';
    }

    constructor(
        private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string) {
    }

    find(id: number): Observable<IInscriptionBulk> {
        throw new Error('not implemented');
    }

    findAll(): Observable<IInscriptionBulk[]> {
        throw new Error('not implemented');
    }

    create(entity: IInscriptionBulk): Observable<IInscriptionBulk> {
        return this.http.post<any>(this.Route, entity);
    }

    update(entity: IInscriptionBulk): Observable<IInscriptionBulk> {
        return this.http.put<any>(this.Route, entity);
    }
    
    delete(id: number): Observable<IInscriptionBulk> {
        throw new Error('not implemented');
    }
}