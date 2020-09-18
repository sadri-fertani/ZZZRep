import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { IRepositoryBase } from './IRepositoryBase';

import { IEcole } from '../models/IEcole';

@Injectable()
export class RepositoryEcole implements IRepositoryBase<IEcole> {

    private get Route(): string {
        return this.baseUrl + 'api/Administrator/Ecole';
    }

    constructor(
        private http: HttpClient, 
        @Inject('BASE_URL') private baseUrl: string) {
    }

    find(id: number): Observable<IEcole> {
        return this.http.get<IEcole>(this.Route + `/${id}`);
    }

    findAll(): Observable<IEcole[]> {
        return this.http.get<IEcole[]>(this.Route);
    }

    create(entity: IEcole): Observable<IEcole> {
        return this.http.post<any>(this.Route, entity);
    }

    update(entity: IEcole): Observable<IEcole> {
        return this.http.put<any>(this.Route, entity);
    }
    delete(id: number): Observable<IEcole> {
        return this.http.delete<IEcole>(this.Route + `/${id}`);
    }
}