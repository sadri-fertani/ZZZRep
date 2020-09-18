import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IInscription } from 'src/models/IInscription';

@Component({
    selector: 'admin-inscriptions-delete-modal',
    templateUrl: './admin-inscriptions-delete-modal.component.html'
})
export class AdminInscriptionsDeleteModalComponent {

    @Input() inscription: IInscription;

    constructor(public activeModal: NgbActiveModal) {
    }
}
