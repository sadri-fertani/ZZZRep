import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AdminFonctionsDeleteModalComponent } from '../admin-fonctions-delete-modal/admin-fonctions-delete-modal.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RepositoryFonction } from '../../../../repositories/RepositoryFonction';



import { IFonction } from 'src/models/IFonction';



@Component({
  selector: 'admin-fonctions-list',
  templateUrl: './admin-fonctions-list.component.html'
})

export class AdminFonctionsListComponent {



  private fonctions: Array<IFonction>;
  public searchString: string;

  public get Fonctions(): Array<IFonction> {
    return this.fonctions;
  }

  public set Fonctions(value) {
    this.fonctions = value;
  }

  constructor(
    private repoFonction: RepositoryFonction,
    private spinner: NgxSpinnerService,
    private toastrSrv: ToastrService,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    this.loadData();
  }

  public deleteFonction(fonction: IFonction): void {
    this.spinner.show();

    this.repoFonction.delete(fonction.id)
      .subscribe(
        () => {
          this.toastrSrv.success(`La fonction ${fonction.nom} a été bien supprimé.`, 'Succès', {
            timeOut: 4000,
            positionClass: 'toast-bottom-right'
          });
          this.loadData();
        }
      );
  }

  public loadData(): void {
    this.spinner.show();

    this.repoFonction
      .findAll()
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })).subscribe(result => {
          this.Fonctions = result;
        });
  }
 


  getProfilePicObject() {
    var imag = new Image()
    imag.src = '../../../../assets/img/logoT.png';


    return {
      imag,
      width: 75,
      alignment: 'right'
    };
  }
  public openModalDelete(fonction: IFonction): void {
    const modalRef = this.modalService.open(AdminFonctionsDeleteModalComponent);
    modalRef.componentInstance.fonction = fonction;

    modalRef.result
      .then((result: boolean) => {
        if (result === true) {
          this.deleteFonction(fonction);
        }
      })
      .catch((reason) => {
        console.warn('modal delete catch exit : ', reason)
      });
    }
   


}

