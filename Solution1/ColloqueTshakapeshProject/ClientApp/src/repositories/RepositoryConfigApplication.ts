import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RepositoryConfigApplication {

    private get Route(): string {
        return this.baseUrl + 'api/Administrator/ApplicationConfig';
    }

    constructor(
        private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string) {
    }

    getFlagAllowRegister(): Observable<boolean> {
        return this.http.get<boolean>(this.Route);
    }

    setFlagAllowRegister(allowRegister: boolean): Observable<any> {
        return this.http.options(this.Route + `/UpdateFlagRegisterAdmin/${allowRegister}`);
    }
}