import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { RepositoryTypeColloque } from '../../../../repositories/RepositoryTypeColloque';

import { ITypeColloque } from 'src/models/ITypeColloque';

@Component({
    selector: 'admin-typeColloques-edit',
    templateUrl: './admin-typeColloques-edit.component.html'
})

export class AdminTypeColloquesEditComponent implements OnInit {
    public oldTypeColloqueForm: FormGroup;
    public typeColloque: ITypeColloque;

    constructor(
        private repoTypeColloque: RepositoryTypeColloque,
        private spinner: NgxSpinnerService,
        private toastrSrv: ToastrService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit() {

        this.oldTypeColloqueForm = this.formBuilder.group({
            nom: ['', Validators.required]
           
        });

        this.repoTypeColloque.find(Number.parseInt(this.route.snapshot.paramMap.get('id'))).subscribe((result:ITypeColloque) => {
            this.typeColloque = result;

            this.oldTypeColloqueForm.controls.nom.setValue(this.typeColloque.nom);
         
        });
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.oldTypeColloqueForm.controls;
    }

    onSubmit() {
        // stop here if form is invalid
        if (this.oldTypeColloqueForm.invalid) {
            return;
        }

        this.spinner.show();

        let typeColloque = {
            id: this.typeColloque.id,
            nom: this.oldTypeColloqueForm.controls.nom.value,
          
        } as ITypeColloque;

        this.repoTypeColloque.update(typeColloque).subscribe(
            () => {
                this.toastrSrv.success(`La type colloque, ${typeColloque.nom}, a été bien modifié.`, 'Succès', {
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
        this.oldTypeColloqueForm.reset();
        this.router.navigate(['/admin/typeColloques']);
    }
}

