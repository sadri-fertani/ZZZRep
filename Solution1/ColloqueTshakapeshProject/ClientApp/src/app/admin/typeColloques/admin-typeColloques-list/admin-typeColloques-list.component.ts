import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AdminTypeColloquesDeleteModalComponent } from '../admin-typeColloques-delete-modal/admin-typeColloques-delete-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RepositoryTypeColloque } from '../../../../repositories/RepositoryTypeColloque';



import { ITypeColloque } from 'src/models/ITypeColloque';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'admin-typeColloques-list',
  templateUrl: './admin-typeColloques-list.component.html'
})

export class AdminTypeColloquesListComponent {

  private typeColloques: Array<ITypeColloque>;
  public searchString: string;

  public get TypeColloques(): Array<ITypeColloque> {
    return this.typeColloques;
  }

  public set TypeColloques(value) {
    this.typeColloques = value;
  }

  constructor(
    private repoTypeColloque: RepositoryTypeColloque,
    private spinner: NgxSpinnerService,
    private toastrSrv: ToastrService,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    this.loadData();
  }

  public deleteTypeColloque(typeColloque: ITypeColloque): void {
    this.spinner.show();

    this.repoTypeColloque.delete(typeColloque.id)
      .subscribe(
        () => {
          this.toastrSrv.success(`Le type colloque ${typeColloque.nom} a été bien supprimé.`, 'Succès', {
            timeOut: 4000,
            positionClass: 'toast-bottom-right'
          });
          this.loadData();
        }
      );
  }

  public loadData(): void {
    this.spinner.show();

    this.repoTypeColloque
      .findAll()
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })).subscribe(result => {
          this.TypeColloques = result;
        });
  }

  public openModalDelete(typeColloque: ITypeColloque): void {
    const modalRef = this.modalService.open(AdminTypeColloquesDeleteModalComponent);
    modalRef.componentInstance.typeColloque = typeColloque;

    modalRef.result
      .then((result: boolean) => {
        if (result === true) {
          this.deleteTypeColloque(typeColloque);
        }
      })
      .catch((reason) => {
        console.warn('modal delete catch exit : ', reason)
      });
    }
    

}

