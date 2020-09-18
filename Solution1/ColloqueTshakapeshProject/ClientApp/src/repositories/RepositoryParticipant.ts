import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { IRepositoryBase } from './IRepositoryBase';

import { IParticipant } from 'src/models/IParticipant';

@Injectable()
export class RepositoryParticipant implements IRepositoryBase<IParticipant> {

    private get Route(): string {
        return this.baseUrl + 'api/Administrator/Participant';
    }

    constructor(
        private http: HttpClient, 
        @Inject('BASE_URL') private baseUrl: string) {
    }

    find(id: number): Observable<IParticipant> {
        return this.http.get<IParticipant>(this.Route + `/${id}`);
    }

    findAll(): Observable<IParticipant[]> {
        return this.http.get<IParticipant[]>(this.Route);
    }

    create(entity: IParticipant): Observable<IParticipant> {
        return this.http.post<any>(this.Route, entity);
    }

    update(entity: IParticipant): Observable<IParticipant> {
        return this.http.put<any>(this.Route, entity);
    }
    delete(id: number): Observable<IParticipant> {
        return this.http.delete<IParticipant>(this.Route + `/${id}`);
    }
}