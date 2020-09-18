import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFonction } from 'src/models/IFonction';

@Component({
    selector: 'admin-fonctions-delete-modal',
    templateUrl: './admin-fonctions-delete-modal.component.html'
})
export class AdminFonctionsDeleteModalComponent {

    @Input() fonction: IFonction;

    constructor(public activeModal: NgbActiveModal) {
    }
}
