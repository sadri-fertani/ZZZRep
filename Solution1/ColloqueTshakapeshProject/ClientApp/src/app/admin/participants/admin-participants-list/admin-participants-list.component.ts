import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { NgxSpinnerService } from 'ngx-spinner';

import { RepositoryParticipant } from '../../../../repositories/RepositoryParticipant';

import { IParticipant } from 'src/models/IParticipant';

@Component({
  selector: 'admin-participants-list',
  templateUrl: './admin-participants-list.component.html'
})
export class AdminParticipantsListComponent {

  private participants: Array<IParticipant>;
  public searchPrenom: string;
  public searchNom: string;

  //initializing p to one
  public p: number = 1;

  public get Participants(): Array<IParticipant> {
    return this.participants;
  }

  public set Participants(value) {
    this.participants = value;
  }

  constructor(
    private repoParticipant: RepositoryParticipant,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.searchPrenom = '';
    this.searchNom = '';

    this.loadData();
  }

  public loadData(): void {
    this.spinner.show();

    this.repoParticipant
      .findAll()
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })).subscribe(result => {
          this.Participants = result;
        });
  }
}
