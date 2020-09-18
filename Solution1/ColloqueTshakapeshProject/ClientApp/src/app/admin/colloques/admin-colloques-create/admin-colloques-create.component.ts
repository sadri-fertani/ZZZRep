import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import * as $ from "jquery";

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';

import { RepositoryColloque } from '../../../../repositories/RepositoryColloque';

import { IColloque } from 'src/models/IColloque';
import { ITypeColloque } from 'src/models/ITypeColloque';
import { Observable } from 'rxjs';
import { RepositoryTypeColloque } from 'src/repositories/RepositoryTypeColloque';

@Component({
    selector: 'admin-colloques-create',
    templateUrl: './admin-colloques-create.component.html',
    providers: [NgbTimepickerConfig]
})

export class AdminColloquesCreateComponent implements OnInit {
    public newColloqueForm: FormGroup;
    public listTypeColloques$: Observable<Array<ITypeColloque>>;

    constructor(
        private repoColloque: RepositoryColloque,
        private repoTypeColloque: RepositoryTypeColloque,
        private spinner: NgxSpinnerService,
        private toastrSrv: ToastrService,
        private formBuilder: FormBuilder,
        private router: Router,
        config: NgbTimepickerConfig) {
        config.spinners = false;
    }

    ngOnInit() {
        this.listTypeColloques$ = this.repoTypeColloque.findAll();

        this.newColloqueForm = this.formBuilder.group({
            titre: ['', Validators.required],
            description: ['', Validators.nullValidator],
            typeId: ['', Validators.required],
            cout: [null, Validators.required],
            nombreParticipantMax: [null, Validators.required],
            responsable: ['', Validators.nullValidator],
            emplacement: ['', Validators.required],
            dureeColloque: [null, Validators.required],
            dateColloque: [null, Validators.required],
            heureColloque: [null, Validators.required]
        });

        $(document).ready(() => {
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === "class") {
                        $(mutation.target).trigger('classChanged');
                    }
                });
            });

            observer.observe($(document.querySelector('ngb-timepicker'))[0], {
                attributes: true
            });

            $($(document.querySelector('ngb-timepicker'))[0]).on('classChanged', e => {
                if (document.querySelector('ngb-timepicker').className.includes('ng-invalid')) {
                    document.querySelectorAll('ngb-timepicker>fieldset>div>div>input').forEach(i => {
                        i.classList.add('time-picker-input-invalide');
                    })
                } else {
                    document.querySelectorAll('ngb-timepicker>fieldset>div>div>input').forEach(i => {
                        i.classList.remove('time-picker-input-invalide');
                    })
                }
            });
        });
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.newColloqueForm.controls;
    }

    onSubmit() {
        // stop here if form is invalid
        if (this.newColloqueForm.invalid) {
            return;
        }

        this.spinner.show();

        let colloque = {
            titre: this.newColloqueForm.controls.titre.value,
            typeId: Number.parseInt(this.newColloqueForm.controls.typeId.value),
            description: this.newColloqueForm.controls.description.value,
            cout: this.newColloqueForm.controls.cout.value,
            emplacement: this.newColloqueForm.controls.emplacement.value,
            responsable: this.newColloqueForm.controls.responsable.value,
            nombreParticipantMax: this.newColloqueForm.controls.nombreParticipantMax.value,
            dureeColloque: this.newColloqueForm.controls.dureeColloque.value,
            dateColloque: new Date(Date.UTC(
                Number.parseInt(this.newColloqueForm.controls.dateColloque.value.year),
                Number.parseInt(this.newColloqueForm.controls.dateColloque.value.month) - 1,
                Number.parseInt(this.newColloqueForm.controls.dateColloque.value.day),
                Number.parseInt(this.newColloqueForm.controls.heureColloque.value.hour),
                Number.parseInt(this.newColloqueForm.controls.heureColloque.value.minute)
            ))
        } as IColloque;

        this.repoColloque.create(colloque).subscribe(
            () => {
                this.toastrSrv.success(`La nouvelle colloque, ${colloque.titre}, a été bien créé.`, 'Succès', {
                    timeOut: 4000,
                    positionClass: 'toast-bottom-right'
                });
                this.router.navigate(['/admin/colloques']);
            },
            null,
            () => {
                this.spinner.hide();
            }
        );
    }

    onReset() {
        this.newColloqueForm.reset();
        this.router.navigate(['/admin/colloques']);
    }
}

