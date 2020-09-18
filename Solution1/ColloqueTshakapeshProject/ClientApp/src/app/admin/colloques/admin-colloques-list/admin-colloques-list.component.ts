import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AdminColloquesOneModalComponent } from '../admin-colloques-one-modal/admin-colloques-one-modal.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RepositoryColloque } from '../../../../repositories/RepositoryColloque';

import { IColloque } from 'src/models/IColloque';

@Component({
  selector: 'admin-colloques-list',
  templateUrl: './admin-colloques-list.component.html'
})
export class AdminColloquesListComponent {

  private colloques: Array<IColloque>;
  public searchString: string;

  public get Colloques(): Array<IColloque> {
    return this.colloques;
  }

  public set Colloques(value) {
    this.colloques = value;
  }

  constructor(
    private repoColloque: RepositoryColloque,
    private spinner: NgxSpinnerService,
    private toastrSrv: ToastrService,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    this.loadData();
  }

  public deleteColloque(colloque: IColloque): void {
    this.spinner.show();

    this.repoColloque.delete(colloque.id)
      .subscribe(
        () => {
          this.toastrSrv.success(`La colloque '${colloque.titre}' a été bien supprimé.`, 'Succès', {
            timeOut: 4000,
            positionClass: 'toast-bottom-right'
          });
          this.loadData();
        }
      );
  }

  public loadData(): void {
    this.spinner.show();

    this.repoColloque
      .findAll()
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })).subscribe(result => {
          this.Colloques = result;
        });
  }

  public openModalDetails(colloque: IColloque): void {
    const modalRef = this.modalService.open(AdminColloquesOneModalComponent);
    modalRef.componentInstance.colloque = colloque;
  }
  
}
