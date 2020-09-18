import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { IRepositoryBase } from './IRepositoryBase';

import { ToastrService } from 'ngx-toastr';

import { IFonction } from '../models/IFonction';

@Injectable()
export class RepositoryFonction implements IRepositoryBase<IFonction> {

    private get Route(): string {
        return this.baseUrl + 'api/Administrator/Fonction';
    }

    constructor(
        private http: HttpClient, 
        @Inject('BASE_URL') private baseUrl: string) {
    }

    find(id: number): Observable<IFonction> {
        return this.http.get<IFonction>(this.Route + `/${id}`);
    }

    findAll(): Observable<IFonction[]> {
        return this.http.get<IFonction[]>(this.Route);
    }

    create(entity: IFonction): Observable<IFonction> {
        return this.http.post<any>(this.Route, entity);
    }

    update(entity: IFonction): Observable<IFonction> {
        return this.http.put<any>(this.Route, entity);
    }
    delete(id: number): Observable<IFonction> {
        return this.http.delete<IFonction>(this.Route + `/${id}`);
    }
}