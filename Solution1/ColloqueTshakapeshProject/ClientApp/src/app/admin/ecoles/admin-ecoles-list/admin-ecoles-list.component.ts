import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AdminEcolesDeleteModalComponent } from '../admin-ecoles-delete-modal/admin-ecoles-delete-modal.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RepositoryEcole } from '../../../../repositories/RepositoryEcole';

import { IEcole } from 'src/models/IEcole';

@Component({
  selector: 'admin-ecoles-list',
  templateUrl: './admin-ecoles-list.component.html'
})
export class AdminEcolesListComponent {

  private ecoles: Array<IEcole>;
  public searchString: string;

  public get Ecoles(): Array<IEcole> {
    return this.ecoles;
  }

  public set Ecoles(value) {
    this.ecoles = value;
  }

  constructor(
    private repoEcole: RepositoryEcole,
    private spinner: NgxSpinnerService,
    private toastrSrv: ToastrService,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    this.loadData();
  }

  public deleteEcole(ecole: IEcole): void {
    this.spinner.show();

    this.repoEcole.delete(ecole.id)
      .subscribe(
        () => {
          this.toastrSrv.success(`L'école ${ecole.nom} a été bien supprimé.`, 'Succès', {
            timeOut: 4000,
            positionClass: 'toast-bottom-right'
          });
          this.loadData();
        }
      );
  }

  public loadData(): void {
    this.spinner.show();

    this.repoEcole
      .findAll()
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })).subscribe(result => {
          this.Ecoles = result;
        });
  }

  public openModalDelete(ecole: IEcole): void {
    const modalRef = this.modalService.open(AdminEcolesDeleteModalComponent);
    modalRef.componentInstance.ecole = ecole;

    modalRef.result
      .then((result: boolean) => {
        if (result === true) {
          this.deleteEcole(ecole);
        }
      })
      .catch((reason) => {
        console.warn('modal delete catch exit : ', reason)
      });
  }
}
