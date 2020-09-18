import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { AdminInscriptionsOneModalComponent } from '../admin-inscriptions-one-modal/admin-inscriptions-one-modal.component';
import { AdminInscriptionsDeleteModalComponent } from '../admin-inscriptions-delete-modal/admin-inscriptions-delete-modal.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RepositoryInscription } from '../../../../repositories/RepositoryInscription';
import { RepositoryColloque } from '../../../../repositories/RepositoryColloque';
import { RepositoryPdfCreator } from '../../../../repositories/RepositoryPdfCreator';
import { IInscription } from 'src/models/IInscription';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import { IColloque } from '../../../../models/IColloque';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'admin-inscriptions-list',
  templateUrl: './admin-inscriptions-list.component.html'
})

export class AdminInscriptionsListComponent {

  public listColloques$: Observable<Array<IColloque>>;
  private inscriptions: Array<IInscription>;

  public searchColloque: string;
  public searchGuid: string;
  public searchPrenom: string;
  public searchNom: string;

  //initializing p to one
  public p: number = 1;

  public get Inscriptions(): Array<IInscription> {
    return this.inscriptions;
  }

  public set Inscriptions(value) {
    this.inscriptions = value;
  }

  constructor(
    private repoColloques: RepositoryColloque,
    private repoInscriptions: RepositoryInscription,
    private spinner: NgxSpinnerService,
    private toastrSrv: ToastrService,
    private repoPdfCreator: RepositoryPdfCreator,
    private modalService: NgbModal) {
  }

  ngOnInit() {

    this.listColloques$ = this.repoColloques.findAll();

    this.searchColloque = '';
    this.searchGuid = '';
    this.searchPrenom = '';
    this.searchNom = '';

    this.loadData();
  }

  public deleteInscriptions(inscription: IInscription): void {
    this.spinner.show();

    this.repoInscriptions.delete(inscription.id)
      .subscribe(
        () => {
          this.toastrSrv.success(`L'inscription ${inscription.id} a été bien supprimé.`, 'Succès', {
            timeOut: 4000,
            positionClass: 'toast-bottom-right'
          });
          this.loadData();
        }
      );
  }

  public loadData(): void {
    this.spinner.show();

    this.repoInscriptions
      .findAll()
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })).subscribe(result => {
          this.Inscriptions = result;
        });
  }

  public openModalDetails(inscription: IInscription): void {
    const modalRef = this.modalService.open(AdminInscriptionsOneModalComponent);
    modalRef.componentInstance.inscription = inscription;
  }

  public openModalDelete(inscription: IInscription): void {
    const modalRef = this.modalService.open(AdminInscriptionsDeleteModalComponent);
    modalRef.componentInstance.inscription = inscription;

    modalRef.result
      .then((result: boolean) => {
        if (result === true) {
          this.deleteInscriptions(inscription);
        }
      })
      .catch((reason) => {
        console.warn('modal delete catch exit : ', reason)
      });
  }
  generateOnePdf(inscription: IInscription) {
    this.repoPdfCreator.getDocumentOne(inscription.guid).subscribe((result) => {
      var blob = new Blob([result], { type: 'application/pdf' });
      saveAs(blob, `inscription-${inscription.participantPrenom}-${inscription.participantName}.pdf`)
    },
      e => {
        this.toastrSrv.error('Erreur lors de la récupération du pdf de confirmation', 'Erreur', {
          timeOut: 4000,
          positionClass: 'toast-bottom-right'
        });
      });
  }

  generatePdf() {
    const documentDefinition = this.getDocumentDefinition();
    pdfMake.createPdf(documentDefinition).open();
  }

  getDocumentDefinition() {

    sessionStorage.setItem('IInscriptions', JSON.stringify(this.inscriptions));
    return {
      content: [
        {
          text: 'Colloque Tshakapesh',
          bold: true,
          fontSize: 24,
          alignment: 'center',
          margin: [0, 0, 0, 40]
        },
        {
          text: 'Total Inscriptions: ' + this.contaLinhasTabela(),
          bold: true,
          fontSize: 18,
          alignment: 'left',
          margin: [0, 0, 0, 20]
        },
        this.getInscriptionObject(this.inscriptions),

      ],
      styles: {
        name: {
          fontSize: 14,


          bold: true
        }
      }

    };
  }

  getInscriptionObject(inscriptions: IInscription[]) {
    return {
      table: {
        widths: ['auto', 'auto', 'auto', 'auto'],
        alignment: 'center',
        body: [
          [{
            text: '#',
            style: 'tableHeader'

          },
          {
            text: 'Participant',
            style: 'tableHeader'
          },
          {
            text: 'Colloque',
            style: 'tableHeader'
          },
          {
            text: 'Guid',
            style: 'tableHeader'
          }
          ],
          ...inscriptions
            .filter(i => i.guid.toLowerCase().includes(this.searchGuid.toLowerCase()))
            .filter(i => i.participantPrenom.toLowerCase().includes(this.searchPrenom.toLowerCase()))
            .filter(i => i.participantName.toLowerCase().includes(this.searchNom.toLowerCase()))
            .filter(i => i.colloqueName.toLowerCase().includes(this.searchColloque.toLowerCase()))
            .map((ed, index) => {
              return [index + 1,
              ed.participantPrenom + ' ' + ed.participantName,
              ed.colloqueName,
              ed.guid
              ];
            })
        ]
      }
    };
  }

  public contaLinhasTabela() {

    return this.inscriptions
      .filter(i => i.guid.toLowerCase().includes(this.searchGuid.toLowerCase()))
      .filter(i => i.participantPrenom.toLowerCase().includes(this.searchPrenom.toLowerCase()))
      .filter(i => i.participantName.toLowerCase().includes(this.searchNom.toLowerCase()))
      .filter(i => i.colloqueName.toLowerCase().includes(this.searchColloque.toLowerCase()))
      .length
  }
}
