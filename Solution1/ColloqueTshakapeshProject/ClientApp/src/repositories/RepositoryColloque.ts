import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { IRepositoryBase } from './IRepositoryBase';

import { IColloque } from 'src/models/IColloque';

@Injectable()
export class RepositoryColloque implements IRepositoryBase<IColloque> {

    private get Route(): string {
        return this.baseUrl + 'api/Administrator/Colloque';
    }

    constructor(
        private http: HttpClient, 
        @Inject('BASE_URL') private baseUrl: string) {
    }

    find(id: number): Observable<IColloque> {
        return this.http.get<IColloque>(this.Route + `/${id}`);
    }

    findAll(): Observable<IColloque[]> {
        return this.http.get<IColloque[]>(this.Route);
    }

    create(entity: IColloque): Observable<IColloque> {
        return this.http.post<any>(this.Route, entity);
    }

    update(entity: IColloque): Observable<IColloque> {
        return this.http.put<any>(this.Route, entity);
    }
    delete(id: number): Observable<IColloque> {
        return this.http.delete<IColloque>(this.Route + `/${id}`);
    }
}