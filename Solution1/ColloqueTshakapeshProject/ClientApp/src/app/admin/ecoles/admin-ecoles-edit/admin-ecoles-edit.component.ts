import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { RepositoryEcole } from '../../../../repositories/RepositoryEcole';

import { IEcole } from 'src/models/IEcole';

@Component({
    selector: 'admin-ecoles-edit',
    templateUrl: './admin-ecoles-edit.component.html'
})

export class AdminEcolesEditComponent implements OnInit {
    public oldEcoleForm: FormGroup;
    public ecole: IEcole;

    constructor(
        private repoEcole: RepositoryEcole,
        private spinner: NgxSpinnerService,
        private toastrSrv: ToastrService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit() {

        this.oldEcoleForm = this.formBuilder.group({
            nom: ['', Validators.required],
            email: ['', [Validators.nullValidator, Validators.email]],
            telephone: ['', Validators.nullValidator],
            adresse: ['', Validators.required]
        });

        this.repoEcole.find(Number.parseInt(this.route.snapshot.paramMap.get('id'))).subscribe((result:IEcole) => {
            this.ecole = result;

            this.oldEcoleForm.controls.nom.setValue(this.ecole.nom);
            this.oldEcoleForm.controls.email.setValue(this.ecole.email);
            this.oldEcoleForm.controls.telephone.setValue(this.ecole.telephone);
            this.oldEcoleForm.controls.adresse.setValue(this.ecole.adresse);
        });
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.oldEcoleForm.controls;
    }

    onSubmit() {
        // stop here if form is invalid
        if (this.oldEcoleForm.invalid) {
            return;
        }

        this.spinner.show();

        let ecole = {
            id: this.ecole.id,
            nom: this.oldEcoleForm.controls.nom.value,
            email: this.oldEcoleForm.controls.email.value,
            telephone: this.oldEcoleForm.controls.telephone.value,
            adresse: this.oldEcoleForm.controls.adresse.value
        } as IEcole;

        this.repoEcole.update(ecole).subscribe(
            () => {
                this.toastrSrv.success(`L'école, ${ecole.nom}, a été bien modifié.`, 'Succès', {
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
        this.oldEcoleForm.reset();
        this.router.navigate(['/admin/ecoles']);
    }
}

