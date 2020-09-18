import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IInscription } from 'src/models/IInscription';

@Component({
    selector: 'admin-inscriptions-one-modal',
    templateUrl: './admin-inscriptions-one-modal.component.html'
})
export class AdminInscriptionsOneModalComponent {

    @Input() inscription: IInscription;

    constructor(public activeModal: NgbActiveModal) {
    }
}
