import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { RepositoryConfigApplication } from 'src/repositories/RepositoryConfigApplication';

import { AuthorizeService } from 'src/api-authorization/authorize.service';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  public isAuthorized: Observable<boolean>;
  public isAllowRegister: Observable<boolean>;

  public get IsAuthorized(): Observable<boolean> {
    return this.isAuthorized;
  }

  public set IsAuthorized(value) {
    this.isAuthorized = value;
  }

  public get IsAllowRegister(): Observable<boolean> {
    return this.isAllowRegister;
  }

  public set IsAllowRegister(value) {
    this.isAllowRegister = value;
  }

  constructor(
    private authorizeSrv: AuthorizeService,
    private repoConfigApplication: RepositoryConfigApplication,
    private toastrSrv: ToastrService,
    private spinner: NgxSpinnerService
  ) {

  }

  ngOnInit() {
    this.IsAuthorized = this.authorizeSrv.isAuthenticated();
    this.IsAllowRegister = this.repoConfigApplication.getFlagAllowRegister();
  }

  updateFlagAllowRegister(newFlagAllowRegistration: boolean) {
    this.spinner.show();
    
    this.repoConfigApplication.setFlagAllowRegister(newFlagAllowRegistration).subscribe(() => {
      this.IsAllowRegister = this.repoConfigApplication.getFlagAllowRegister();

      this.toastrSrv.success('L\'inscription d\'un administrateur est ' + (newFlagAllowRegistration ? 'activée' : 'désactivée'), 'Succès', {
        timeOut: 4000,
        positionClass: 'toast-bottom-right'
      });
    },
    null,
    () => {
        this.spinner.hide();
    });
  }
}
