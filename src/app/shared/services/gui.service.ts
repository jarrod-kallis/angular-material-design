import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../app.reducer';
import { StartLoading, StopLoading } from '../store/gui.actions';

@Injectable({
  providedIn: 'root'
})
export class GuiService {
  constructor(private snackBar: MatSnackBar, private store: Store<fromRoot.State>) { }

  set isLoading(value: boolean) {
    this.store.dispatch(value ? new StartLoading() : new StopLoading());
  }

  public showSnackBar(message: string, action: string = null, duration: number = 3000) {
    this.snackBar.open(message, action, { duration });
  }
}
