import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEcole } from 'src/models/IEcole';

@Component({
    selector: 'admin-ecoles-delete-modal',
    templateUrl: './admin-ecoles-delete-modal.component.html'
})
export class AdminEcolesDeleteModalComponent {

    @Input() ecole: IEcole;

    constructor(public activeModal: NgbActiveModal) {
    }
}
