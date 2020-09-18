import { Component } from '@angular/core';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  public isAuthorized: Observable<boolean>;

  isExpanded = false;

  public get IsAuthorized(): Observable<boolean> {
    return this.isAuthorized;
  }

  public set IsAuthorized(value) {
    this.isAuthorized = value;
  }

  constructor(private authorizeSrv: AuthorizeService) {
    
  }

  ngOnInit() {
    this.IsAuthorized = this.authorizeSrv.isAuthenticated();
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
