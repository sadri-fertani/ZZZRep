import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { RepositoryParticipant } from '../../../../repositories/RepositoryParticipant';
import { RepositoryFonction } from '../../../../repositories/RepositoryFonction';
import { RepositoryEcole } from '../../../../repositories/RepositoryEcole';

import { IParticipant } from 'src/models/IParticipant';
import { IFonction } from 'src/models/IFonction';
import { IEcole } from 'src/models/IEcole';

@Component({
    selector: 'admin-participants-edit',
    templateUrl: './admin-participants-edit.component.html'
})

export class AdminParticipantsEditComponent implements OnInit {
    public oldParticipantForm: FormGroup;
    public participant: IParticipant;

    public listFonctions$: Observable<Array<IFonction>>;
    public listEcoles$: Observable<Array<IEcole>>;

    constructor(
        private repoParticipant: RepositoryParticipant,
        private repoFonction: RepositoryFonction,
        private repoEcole: RepositoryEcole,
        private spinner: NgxSpinnerService,
        private toastrSrv: ToastrService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit() {

        this.listFonctions$ = this.repoFonction.findAll();
        this.listEcoles$ = this.repoEcole.findAll();

        this.oldParticipantForm = this.formBuilder.group({
            nomParticipant: ['', Validators.required],
            prenomParticipant: ['', Validators.required],
            emailParticipant: ['', [Validators.nullValidator, Validators.email]],
            telephoneParticipant: ['', Validators.nullValidator],            
            fonctionIdParticipant: ['', Validators.nullValidator],
            ecoleIdParticipant: ['', Validators.nullValidator]
        });

        this.repoParticipant.find(Number.parseInt(this.route.snapshot.paramMap.get('id'))).subscribe((result: IParticipant) => {
            this.participant = result;

            this.oldParticipantForm.controls.nomParticipant.setValue(this.participant.nom);
            this.oldParticipantForm.controls.prenomParticipant.setValue(this.participant.prenom);
            this.oldParticipantForm.controls.emailParticipant.setValue(this.participant.courriel);
            this.oldParticipantForm.controls.telephoneParticipant.setValue(this.participant.telephone);            
            this.oldParticipantForm.controls.fonctionIdParticipant.setValue(this.participant.fonctionId);
            this.oldParticipantForm.controls.ecoleIdParticipant.setValue(this.participant.ecoleId);
        });
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.oldParticipantForm.controls;
    }

    onSubmit() {
        // stop here if form is invalid
        if (this.oldParticipantForm.invalid) {
            return;
        }

        this.spinner.show();

        let participant = {
            id: this.participant.id,
            nom: this.f.nomParticipant.value,
            prenom: this.f.prenomParticipant.value,
            courriel: this.f.emailParticipant.value,
            telephone: this.f.telephoneParticipant.value,
            ecoleId: (this.f.ecoleIdParticipant.value as string).length === 0 ? null : Number.parseInt(this.f.ecoleIdParticipant.value),
            fonctionId: (this.f.fonctionIdParticipant.value as string).length === 0 ? null : Number.parseInt(this.f.fonctionIdParticipant.value)        
        } as IParticipant;

        this.repoParticipant.update(participant).subscribe(
            () => {
                this.toastrSrv.success(`Le participant, ${participant.prenom} ${participant.nom}, a été bien modifié.`, 'Succès', {
                    timeOut: 4000,
                    positionClass: 'toast-bottom-right'
                });
                this.router.navigate(['/admin/participants']);
            },
            null,
            () => {
                this.spinner.hide();
            }
        );
    }

    onReset() {
        this.oldParticipantForm.reset();
        this.router.navigate(['/admin/participants']);
    }
}

