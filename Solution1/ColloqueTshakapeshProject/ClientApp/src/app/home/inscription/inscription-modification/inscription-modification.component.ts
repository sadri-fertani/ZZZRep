import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of, forkJoin } from 'rxjs';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from '../../../../services/communication.service';
import { saveAs } from 'file-saver';

import { RepositoryColloque } from '../../../../repositories/RepositoryColloque';
import { RepositoryInscriptionBulk } from '../../../../repositories/RepositoryInscriptionBulk';
import { RepositoryInscription } from '../../../../repositories/RepositoryInscription';
import { RepositoryPdfCreator } from '../../../../repositories/RepositoryPdfCreator';

import { IColloque } from '../../../../models/IColloque';
import { IInscriptionBulk } from '../../../../models/IInscriptionBulk';
import { IParticipant } from '../../../../models/IParticipant';
import { IMessage } from '../../../../models/IMessage';
import { IInscription } from '../../../../models/IInscription';

import { atLeastOneCheckboxCheckedValidator } from "../../../../custom-validator/atLeastOneCheckboxCheckedValidator";
import { map } from 'rxjs/operators';

@Component({
  selector: 'inscription',
  templateUrl: './inscription-modification.component.html',
  styleUrls: ['./inscription-modification.component.scss']
})

export class InscriptionModificationComponent implements OnInit {

  public newColloquesChoicesForm: FormGroup;

  public listColloques$: Observable<Array<IColloque>>;
  public listColloques: Array<IColloque> = null;

  public listInscriptions$: Observable<Array<IInscription>>;
  public listInscriptions: Array<IInscription> = null;

  public active: Number;

  public get InscriptionGuid(): string {
    return this.route.snapshot.paramMap.get('guid')
  }

  @ViewChild('NavOutlet', null) NavOutlet: ElementRef;

  constructor(
    private srvCommunication: CommunicationService,
    private repoInscriptionBulk: RepositoryInscriptionBulk,
    private repoInscription: RepositoryInscription,
    private repoColloque: RepositoryColloque,
    private repoPdfCreator: RepositoryPdfCreator,
    private spinner: NgxSpinnerService,
    private toastrSrv: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute, ) {
  }

  ngOnInit() {
    this.listColloques$ = this.repoColloque.findAll();
    this.listInscriptions$ = this.repoInscription.findAllFromGuid(this.InscriptionGuid);

    this.newColloquesChoicesForm = this.formBuilder.group({
    });

    let result$ = forkJoin(
      this.listInscriptions$,
      this.listColloques$
    ).pipe(
      map(([inscriptions, colloques]) => {
        return { inscriptions, colloques };
      })
    ).subscribe(result => {
      this.listInscriptions = result.inscriptions;
      this.listColloques = result.colloques;

      this.newColloquesChoicesForm.addControl(
        "colloquesFormArray",
        this.buildCategoryFormArray(
          result.colloques,
          result.inscriptions.map(x => x.colloqueId.toString())
        )
      );
    });

    this.subscribeToEvents();
  }

  private subscribeToEvents(): void {
    this.srvCommunication.messageReceived.subscribe((message: IMessage) => {
      if (!this.listInscriptions.find(i => i.colloqueId === message.idColloque)) {
        // new colloque booked/unbooked from outside      
        // need update UI
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

  get fColloquesChoices() {
    return this.newColloquesChoicesForm.controls;
  }

  get colloquesFormArray(): FormArray {
    return this.fColloquesChoices && <FormArray>this.fColloquesChoices.colloquesFormArray
  }

  onSubmitColloquesChoicesForm() {
    // stop here if form is invalid
    if (this.newColloquesChoicesForm.invalid) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
      (this.NavOutlet as any).nav.select(2);
    }, 350);
  }

  onUpdateInscription() {
    this.spinner.show();

    let inscriptionToPut: IInscriptionBulk = {
      participant: {
        id: this.listInscriptions[0].participantId,
        nom: this.listInscriptions[0].participantName,
        prenom: this.listInscriptions[0].participantPrenom
      } as IParticipant,
      colloques: (this.fColloquesChoices.colloquesFormArray.value as Array<boolean>).map((x, index) => x ? index : -1).filter(x => x != -1).map(i => (this.listColloques[i]))
    };

    this.repoInscriptionBulk.update(inscriptionToPut).subscribe(
      (result) => {
        this.toastrSrv.success(`L'inscription a été bien modifié.`, 'Succès', {
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

  isBookedLastTime(idColloque: number): boolean {
    return this.listInscriptions.find(i => i.colloqueId == idColloque) != null;
  }

  getTotalCout(): number {
    return (this.fColloquesChoices.colloquesFormArray.value as Array<boolean>).map((x, index) => x ? index : -1).filter(x => x != -1).map(i => (this.listColloques[i].cout)).reduce((a, b) => a + b, 0);
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 3) {
      changeEvent.preventDefault();
    }
  }

  goNextNav(idNext: number) {
    (this.NavOutlet as any).nav.select(idNext);
  }

  onClose() {
    this.newColloquesChoicesForm.reset();
    this.router.navigate(['/home']);
  }

  sendMessage(checked: boolean, idColloque: number): void {

    if (!this.listInscriptions.find(i => i.colloqueId === idColloque)) {
      // new book/unbook of new colloque, no need to inform others
      let message = {
        idColloque: idColloque,
        booked: checked,
        dateMessage: new Date()
      } as IMessage;

      this.srvCommunication.sendMessage(message);
    }
  }
}
