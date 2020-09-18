import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { RepositoryTypeColloque } from '../../../../repositories/RepositoryTypeColloque';

import { ITypeColloque } from 'src/models/ITypeColloque';

@Component({
    selector: 'admin-typeColloques-create',
    templateUrl: './admin-typeColloques-create.component.html'
})

export class AdminTypeColloquesCreateComponent implements OnInit {
    public newTypeColloqueForm: FormGroup;

    constructor(
        private repoTypeColloque: RepositoryTypeColloque,
        private spinner: NgxSpinnerService,
        private toastrSrv: ToastrService,
        private formBuilder: FormBuilder,
        private router: Router) { }

    ngOnInit() {
        this.newTypeColloqueForm = this.formBuilder.group({
            nom: ['', Validators.required]

        });
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.newTypeColloqueForm.controls;
    }

    onSubmit() {
        // stop here if form is invalid
        if (this.newTypeColloqueForm.invalid) {
            return;
        }

        this.spinner.show();

        let typecolloque = {
            nom: this.newTypeColloqueForm.controls.nom.value
          
        } as ITypeColloque;

        this.repoTypeColloque.create(typecolloque).subscribe(
            () => {
                this.toastrSrv.success(`La nouvelle TypeColloque, ${typecolloque.nom}, a été bien créé.`, 'Succès', {
                    timeOut: 4000,
                    positionClass: 'toast-bottom-right'
                });
                this.router.navigate(['/admin/typeColloques']);
            },
            null,
            () => {
                this.spinner.hide();
            }
        );
    }

    onReset() {
        this.newTypeColloqueForm.reset();
        this.router.navigate(['/admin/typeColloques']);
    }
}

