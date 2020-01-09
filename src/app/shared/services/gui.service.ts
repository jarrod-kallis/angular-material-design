import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuiService {
  private _onLoadingChangedEvent = new Subject<boolean>();

  constructor() { }

  public get onLoadingChangedEvent(): Subject<boolean> {
    return this._onLoadingChangedEvent;
  }

  set isLoading(value: boolean) {
    this._onLoadingChangedEvent.next(value);
  }
}
