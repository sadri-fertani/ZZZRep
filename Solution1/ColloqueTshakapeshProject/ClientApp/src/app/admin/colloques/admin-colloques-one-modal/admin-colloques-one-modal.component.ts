import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IColloque } from 'src/models/IColloque';

@Component({
    selector: 'admin-colloques-one-modal',
    templateUrl: './admin-colloques-one-modal.component.html'
})
export class AdminColloquesOneModalComponent {

    @Input() colloque: IColloque;

    constructor(public activeModal: NgbActiveModal) {
    }
}
