import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { RepositoryFonction } from '../../../../repositories/RepositoryFonction';

import { IFonction } from 'src/models/IFonction';

@Component({
    selector: 'admin-fonctions-create',
    templateUrl: './admin-fonctions-create.component.html'
})

export class AdminFonctionsCreateComponent implements OnInit {
    public newFonctionForm: FormGroup;

    constructor(
        private repoFonction: RepositoryFonction,
        private spinner: NgxSpinnerService,
        private toastrSrv: ToastrService,
        private formBuilder: FormBuilder,
        private router: Router) { }

    ngOnInit() {
        this.newFonctionForm = this.formBuilder.group({
            nom: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.newFonctionForm.controls;
    }

    onSubmit() {
        // stop here if form is invalid
        if (this.newFonctionForm.invalid) {
            return;
        }

        this.spinner.show();

        let fonction = {
            nom: this.newFonctionForm.controls.nom.value
          
        } as IFonction;

        this.repoFonction.create(fonction).subscribe(
            () => {
                this.toastrSrv.success(`La nouvelle Fonction, ${fonction.nom}, a été bien créé.`, 'Succès', {
                    timeOut: 4000,
                    positionClass: 'toast-bottom-right'
                });
                this.router.navigate(['/admin/fonctions']);
            },
            null,
            () => {
                this.spinner.hide();
            }
        );
    }

    onReset() {
        this.newFonctionForm.reset();
        this.router.navigate(['/admin/fonctions']);
    }
}
