import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import * as $ from "jquery";

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';

import { RepositoryColloque } from '../../../../repositories/RepositoryColloque';

import { IColloque } from 'src/models/IColloque';
import { RepositoryTypeColloque } from 'src/repositories/RepositoryTypeColloque';
import { Observable } from 'rxjs';
import { ITypeColloque } from 'src/models/ITypeColloque';

@Component({
    selector: 'admin-colloques-edit',
    templateUrl: './admin-colloques-edit.component.html',
    providers: [NgbTimepickerConfig]
})

export class AdminColloquesEditComponent implements OnInit {
    public oldColloqueForm: FormGroup;
    public listTypeColloques$: Observable<Array<ITypeColloque>>;
    public colloque: IColloque;

    constructor(
        private repoColloque: RepositoryColloque,
        private repoTypeColloque: RepositoryTypeColloque,
        private spinner: NgxSpinnerService,
        private toastrSrv: ToastrService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        config: NgbTimepickerConfig) {
        config.spinners = false;
    }

    ngOnInit() {
        this.listTypeColloques$ = this.repoTypeColloque.findAll();

        this.oldColloqueForm = this.formBuilder.group({
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

        this.repoColloque.find(Number.parseInt(this.route.snapshot.paramMap.get('id'))).subscribe((result: IColloque) => {
            this.colloque = result;

            const dateColloque = new Date(this.colloque.dateColloque);

            this.oldColloqueForm.controls.titre.setValue(this.colloque.titre);
            this.oldColloqueForm.controls.description.setValue(this.colloque.description);
            this.oldColloqueForm.controls.typeId.setValue(this.colloque.typeId);
            this.oldColloqueForm.controls.cout.setValue(this.colloque.cout);
            this.oldColloqueForm.controls.nombreParticipantMax.setValue(this.colloque.nombreParticipantMax);
            this.oldColloqueForm.controls.responsable.setValue(this.colloque.responsable);
            this.oldColloqueForm.controls.emplacement.setValue(this.colloque.emplacement);
            this.oldColloqueForm.controls.dureeColloque.setValue(this.colloque.dureeColloque);
            this.oldColloqueForm.controls.dateColloque.setValue({
                "year": dateColloque.getFullYear(),
                "month": dateColloque.getMonth() + 1,
                "day": dateColloque.getDate()
            });
            this.oldColloqueForm.controls.heureColloque.setValue({
                "hour": dateColloque.getHours(),
                "minute": dateColloque.getMinutes()
            });
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
        return this.oldColloqueForm.controls;
    }

    onSubmit() {
        // stop here if form is invalid
        if (this.oldColloqueForm.invalid) {
            return;
        }

        this.spinner.show();

        let colloque = {
            id: this.colloque.id,
            titre: this.oldColloqueForm.controls.titre.value,
            typeId: Number.parseInt(this.oldColloqueForm.controls.typeId.value),
            description: this.oldColloqueForm.controls.description.value,
            cout: this.oldColloqueForm.controls.cout.value,
            emplacement: this.oldColloqueForm.controls.emplacement.value,
            responsable: this.oldColloqueForm.controls.responsable.value,
            nombreParticipantMax: this.oldColloqueForm.controls.nombreParticipantMax.value,
            dureeColloque: this.oldColloqueForm.controls.dureeColloque.value,
            dateColloque: new Date(Date.UTC(
                Number.parseInt(this.oldColloqueForm.controls.dateColloque.value.year),
                Number.parseInt(this.oldColloqueForm.controls.dateColloque.value.month) - 1,
                Number.parseInt(this.oldColloqueForm.controls.dateColloque.value.day),
                Number.parseInt(this.oldColloqueForm.controls.heureColloque.value.hour),
                Number.parseInt(this.oldColloqueForm.controls.heureColloque.value.minute)
            ))
        } as IColloque;

        this.repoColloque.update(colloque).subscribe(
            () => {
                this.toastrSrv.success(`La colloque, ${colloque.titre}, a été bien modifié.`, 'Succès', {
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
        this.oldColloqueForm.reset();
        this.router.navigate(['/admin/colloques']);
    }
}

