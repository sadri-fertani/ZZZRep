import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { IRepositoryBase } from './IRepositoryBase';

import { ToastrService } from 'ngx-toastr';

import { ITypeColloque } from '../models/ITypeColloque';

@Injectable()
export class RepositoryTypeColloque implements IRepositoryBase<ITypeColloque> {

    private get Route(): string {
        return this.baseUrl + 'api/Administrator/TypeColloque';
    }

    constructor(
        private http: HttpClient, 
        @Inject('BASE_URL') private baseUrl: string) {
    }

    find(id: number): Observable<ITypeColloque> {
        return this.http.get<ITypeColloque>(this.Route + `/${id}`);
    }

    findAll(): Observable<ITypeColloque[]> {
        return this.http.get<ITypeColloque[]>(this.Route);
    }

    create(entity: ITypeColloque): Observable<ITypeColloque> {
        return this.http.post<any>(this.Route, entity);
    }

    update(entity: ITypeColloque): Observable<ITypeColloque> {
        return this.http.put<any>(this.Route, entity);
    }
    delete(id: number): Observable<ITypeColloque> {
        return this.http.delete<ITypeColloque>(this.Route + `/${id}`);
    }
}