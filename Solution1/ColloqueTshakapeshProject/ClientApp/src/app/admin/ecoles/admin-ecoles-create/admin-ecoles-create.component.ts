import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { RepositoryEcole } from '../../../../repositories/RepositoryEcole';

import { IEcole } from 'src/models/IEcole';

@Component({
    selector: 'admin-ecoles-create',
    templateUrl: './admin-ecoles-create.component.html'
})

export class AdminEcolesCreateComponent implements OnInit {
    public newEcoleForm: FormGroup;

    constructor(
        private repoEcole: RepositoryEcole,
        private spinner: NgxSpinnerService,
        private toastrSrv: ToastrService,
        private formBuilder: FormBuilder,
        private router: Router) { }

    ngOnInit() {
        this.newEcoleForm = this.formBuilder.group({
            nom: ['', Validators.required],
            email: ['', [Validators.nullValidator, Validators.email]],
            telephone: ['', [Validators.nullValidator, Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)]],
            adresse: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.newEcoleForm.controls;
    }

    onSubmit() {
        // stop here if form is invalid
        if (this.newEcoleForm.invalid) {
            return;
        }

        this.spinner.show();

        let ecole = {
            nom: this.newEcoleForm.controls.nom.value,
            email: this.newEcoleForm.controls.email.value,
            telephone: this.newEcoleForm.controls.telephone.value,
            adresse: this.newEcoleForm.controls.adresse.value
        } as IEcole;

        this.repoEcole.create(ecole).subscribe(
            () => {
                this.toastrSrv.success(`La nouvelle école, ${ecole.nom}, a été bien créé.`, 'Succès', {
                    timeOut: 4000,
                    positionClass: 'toast-bottom-right'
                });
                this.router.navigate(['/admin/ecoles']);
            },
            null,
            () => {
                this.spinner.hide();
            }
        );
    }

    onReset() {
        this.newEcoleForm.reset();
        this.router.navigate(['/admin/ecoles']);
    }
}

