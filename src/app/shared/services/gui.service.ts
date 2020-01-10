import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class GuiService {
  private _onLoadingChangedEvent = new Subject<boolean>();

  constructor(private snackBar: MatSnackBar) { }

  public get onLoadingChangedEvent(): Subject<boolean> {
    return this._onLoadingChangedEvent;
  }

  set isLoading(value: boolean) {
    this._onLoadingChangedEvent.next(value);
  }

  public showSnackBar(message: string, action: string = null, duration: number = 3000) {
    this.snackBar.open(message, action, { duration });
  }
}
