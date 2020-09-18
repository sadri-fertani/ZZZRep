import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RepositoryPdfCreator {

    private get Route(): string {
        return this.baseUrl + 'api/PdfCreator';
    }

    constructor(
        private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string) {
    }

    getDocumentOne(guid: string): Observable<any> {
        return this.http.get(this.Route + `/PdfOne/${guid}`, { responseType: 'blob' });
    }

    getDocumentAll(guid: string): Observable<any> {
        return this.http.get(this.Route + `/PdfAll/${guid}`, { responseType: 'blob' });
    }
}