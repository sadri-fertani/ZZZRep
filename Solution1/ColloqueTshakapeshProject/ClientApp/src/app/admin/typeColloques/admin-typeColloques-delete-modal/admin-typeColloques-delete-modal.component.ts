import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeColloque } from 'src/models/ITypeColloque';

@Component({
    selector: 'admin-typeColloques-delete-modal',
    templateUrl: './admin-typeColloques-delete-modal.component.html'
})
export class AdminTypeColloquesDeleteModalComponent {

    @Input() typeColloque: ITypeColloque;

    constructor(public activeModal: NgbActiveModal) {
    }
}
