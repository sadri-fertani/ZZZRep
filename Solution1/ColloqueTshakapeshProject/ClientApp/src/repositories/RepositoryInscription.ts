import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { IRepositoryBase } from './IRepositoryBase';

import { IInscription } from 'src/models/IInscription';

@Injectable()
export class RepositoryInscription implements IRepositoryBase<IInscription> {

    private get Route(): string {
        return this.baseUrl + 'api/Administrator/Inscription';
    }

    constructor(
        private http: HttpClient, 
        @Inject('BASE_URL') private baseUrl: string) {
    }

    find(id: number): Observable<IInscription> {
        return this.http.get<IInscription>(this.Route + `/${id}`);
    }

    findAll(): Observable<IInscription[]> {
        return this.http.get<IInscription[]>(this.Route);
    }

    findAllFromGuid(guid: string): Observable<IInscription[]> {
        return this.http.get<IInscription[]>(this.baseUrl + `api/Inscription/${guid}`);
    }

    create(entity: IInscription): Observable<IInscription> {
        return this.http.post<any>(this.Route, entity);
    }

    update(entity: IInscription): Observable<IInscription> {
        return this.http.put<any>(this.Route, entity);
    }
    delete(id: number): Observable<IInscription> {
        return this.http.delete<IInscription>(this.Route + `/${id}`);
    }
}