import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { RepositoryFonction } from '../../../../repositories/RepositoryFonction';

import { IFonction } from 'src/models/IFonction';

@Component({
    selector: 'admin-fonctions-edit',
    templateUrl: './admin-fonctions-edit.component.html'
})

export class AdminFonctionsEditComponent implements OnInit {
    public oldFonctionForm: FormGroup;
    public fonction: IFonction;

    constructor(
        private repoFonction: RepositoryFonction,
        private spinner: NgxSpinnerService,
        private toastrSrv: ToastrService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit() {

        this.oldFonctionForm = this.formBuilder.group({
            nom: ['', Validators.required]
           
        });

        this.repoFonction.find(Number.parseInt(this.route.snapshot.paramMap.get('id'))).subscribe((result:IFonction) => {
            this.fonction = result;

            this.oldFonctionForm.controls.nom.setValue(this.fonction.nom);
         
        });
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.oldFonctionForm.controls;
    }

    onSubmit() {
        // stop here if form is invalid
        if (this.oldFonctionForm.invalid) {
            return;
        }

        this.spinner.show();

        let fonction = {
            id: this.fonction.id,
            nom: this.oldFonctionForm.controls.nom.value,
          
        } as IFonction;

        this.repoFonction.update(fonction).subscribe(
            () => {
                this.toastrSrv.success(`La fonction, ${fonction.nom}, a été bien modifié.`, 'Succès', {
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
        this.oldFonctionForm.reset();
        this.router.navigate(['/admin/fonctions']);
    }
}

