import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of } from 'rxjs';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from '../../../../services/communication.service';
import { saveAs } from 'file-saver';

import { RepositoryColloque } from '../../../../repositories/RepositoryColloque';
import { RepositoryEcole } from '../../../../repositories/RepositoryEcole';
import { RepositoryFonction } from '../../../../repositories/RepositoryFonction';
import { RepositoryInscriptionBulk } from '../../../../repositories/RepositoryInscriptionBulk';
import { RepositoryPdfCreator } from '../../../../repositories/RepositoryPdfCreator';

import { IEcole } from '../../../../models/IEcole';
import { IFonction } from '../../../../models/IFonction';
import { IColloque } from '../../../../models/IColloque';
import { IInscriptionBulk } from '../../../../models/IInscriptionBulk';
import { IParticipant } from '../../../../models/IParticipant';
import { IMessage } from '../../../../models/IMessage';
import { IInscription } from 'src/models/IInscription';

import { atLeastOneCheckboxCheckedValidator } from "../../../../custom-validator/atLeastOneCheckboxCheckedValidator";

@Component({
  selector: 'inscription',
  templateUrl: './inscription-creation.component.html',
  styleUrls: ['./inscription-creation.component.scss']
})

export class InscriptionCreationComponent implements OnInit {

  public newParticipantForm: FormGroup;
  public newColloquesChoicesForm: FormGroup;

  public listFonctions$: Observable<Array<IFonction>>;
  private listFonctions: Array<IFonction> = null;

  public listEcoles$: Observable<Array<IEcole>>;
  private listEcoles: Array<IEcole> = null;

  public listColloques$: Observable<Array<IColloque>>;
  public listColloques: Array<IColloque> = null;

  public active: Number;

  @ViewChild('NavOutlet', null) NavOutlet: ElementRef;

  constructor(
    private srvCommunication: CommunicationService,
    private repoInscriptionBulk: RepositoryInscriptionBulk,
    private repoColloque: RepositoryColloque,
    private repoFonction: RepositoryFonction,
    private repoEcole: RepositoryEcole,
    private repoPdfCreator: RepositoryPdfCreator,
    private spinner: NgxSpinnerService,
    private toastrSrv: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router) {
  }

  ngOnInit() {
    this.listFonctions$ = this.repoFonction.findAll();
    this.listEcoles$ = this.repoEcole.findAll();
    this.listColloques$ = this.repoColloque.findAll();

    this.newParticipantForm = this.formBuilder.group({
      nomParticipant: ['', Validators.required],
      prenomParticipant: ['', Validators.required],
      emailParticipant: ['', [Validators.nullValidator, Validators.email]],
      telephoneParticipant: ['', Validators.nullValidator],
      fonctionIdParticipant: ['', Validators.nullValidator],
      ecoleIdParticipant: ['', Validators.nullValidator]
    });

    this.newColloquesChoicesForm = this.formBuilder.group({
    });

    this.listFonctions$.subscribe((fonctions: Array<IFonction>) => this.listFonctions = fonctions);

    this.listEcoles$.subscribe((ecoles: Array<IEcole>) => this.listEcoles = ecoles);

    this.listColloques$.subscribe((colloques: Array<IColloque>) => {
      this.listColloques = colloques;
      this.newColloquesChoicesForm.addControl("colloquesFormArray", this.buildCategoryFormArray(colloques));
    });

    this.subscribeToEvents();
  }

  private subscribeToEvents(): void {
    this.srvCommunication.messageReceived.subscribe((message: IMessage) => {
      let targetColloque = this.listColloques.find(c => c.id === message.idColloque);

      if (targetColloque) {
        // fake add/delete
        if (message.booked)
          targetColloque.inscriptions.push({} as IInscription);
        else
          targetColloque.inscriptions.pop();

        // Flash cell
        let targetCell = document.getElementById(`th-dispo-${message.idColloque}`);
        if (targetCell) {
          targetCell.style.backgroundColor = "lightblue";
          setTimeout(() => { targetCell.style.backgroundColor = '' }, 250)
        }
      }
    });
  }

  buildCategoryFormArray(colloques: Array<IColloque>, selectedColloqueIds: string[] = []): FormArray {
    const controlArr = colloques.map(colloque => {
      let isSelected = selectedColloqueIds.some(id => id.toString() === colloque.id.toString());
      return this.formBuilder.control(isSelected);
    })

    return this.formBuilder.array(controlArr, atLeastOneCheckboxCheckedValidator());
  }

  // convenience getter for easy access to form fields
  get fParticipant() {
    return this.newParticipantForm.controls;
  }

  get fColloquesChoices() {
    return this.newColloquesChoicesForm.controls;
  }

  get colloquesFormArray(): FormArray {
    return this.fColloquesChoices && <FormArray>this.fColloquesChoices.colloquesFormArray
  }

  getFonctionName(): Observable<string> {
    return of(this.listFonctions.find(f => f.id == Number.parseInt(this.fParticipant.fonctionIdParticipant.value))!.nom).pipe();
  }

  getEcoleName(): Observable<string> {
    return of(this.listEcoles.find(e => e.id == Number.parseInt(this.fParticipant.ecoleIdParticipant.value))!.nom).pipe();
  }

  onSubmitParticipantForm() {
    // stop here if form is invalid
    if (this.newParticipantForm.invalid) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
      (this.NavOutlet as any).nav.select(2);
    }, 350);
  }

  onSubmitColloquesChoicesForm() {
    // stop here if form is invalid
    if (this.newColloquesChoicesForm.invalid) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
      (this.NavOutlet as any).nav.select(3);
    }, 350);
  }

  onInscription() {
    this.spinner.show();

    let inscriptionToPost: IInscriptionBulk = {
      participant: {
        nom: this.fParticipant.nomParticipant.value,
        prenom: this.fParticipant.prenomParticipant.value,
        courriel: this.fParticipant.emailParticipant.value,
        telephone: this.fParticipant.telephoneParticipant.value,
        fonctionId: (this.fParticipant.fonctionIdParticipant.value as string).length === 0 ? null : Number.parseInt(this.fParticipant.fonctionIdParticipant.value),
        ecoleId: (this.fParticipant.ecoleIdParticipant.value as string).length === 0 ? null : Number.parseInt(this.fParticipant.ecoleIdParticipant.value)
      } as IParticipant,
      colloques: (this.fColloquesChoices.colloquesFormArray.value as Array<boolean>).map((x, index) => x ? index : -1).filter(x => x != -1).map(i => (this.listColloques[i]))
    };

    this.repoInscriptionBulk.create(inscriptionToPost).subscribe(
      (result) => {
        this.toastrSrv.success(`L'inscription a été bien créé.`, 'Succès', {
          timeOut: 4000,
          positionClass: 'toast-bottom-right'
        });
        // get pdf
        let inscription = (result as any) as Array<IInscription>;
        this.getPdfConfirmation(inscription[0].guid, inscription[0].participantPrenom, inscription[0].participantName);
        // go back
        this.router.navigate(['/home']);
      },
      error => { this.spinner.hide(); },
      () => {
        this.spinner.hide();
      }
    );
  }

  getPdfConfirmation(guid: string, prenom: string, nom: string) {
    this.repoPdfCreator.getDocumentAll(guid).subscribe((result) => {
      var blob = new Blob([result], { type: 'application/pdf' });
      saveAs(blob, `inscription-${prenom}-${nom}.pdf`)
    },
      e => {
        this.toastrSrv.error('Erreur lors de la récupération du pdf de confirmation', 'Erreur', {
          timeOut: 4000,
          positionClass: 'toast-bottom-right'
        });
      });
  }

  getTotalCout(): number {
    return (this.fColloquesChoices.colloquesFormArray.value as Array<boolean>).map((x, index) => x ? index : -1).filter(x => x != -1).map(i => (this.listColloques[i].cout)).reduce((a, b) => a + b, 0);
  }

  onExitAllForm() {
    this.newParticipantForm.reset();
    this.newColloquesChoicesForm.reset();
    this.router.navigate(['/home']);
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 3) {
      changeEvent.preventDefault();
    }
  }

  goNextNav(idNext: number) {
    (this.NavOutlet as any).nav.select(idNext);
  }

  sendMessage(checked: boolean, idColloque: number): void {
    let message = {
      idColloque: idColloque,
      booked: checked,
      dateMessage: new Date()
    } as IMessage;

    this.srvCommunication.sendMessage(message);
  }
}
