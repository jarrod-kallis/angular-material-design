import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from './training.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  private exerciseStatusChangedSubscription: Subscription;
  private _trainingTabCaption: string;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.exerciseStatusChangedSubscription = this.trainingService.onExerciseStatusChanged
      .subscribe(() => {
        this._trainingTabCaption = this.trainingService.exerciseStarted ? 'Training In Progress' : 'New Training';
      });
  }

  ngOnDestroy() {
    this.exerciseStatusChangedSubscription.unsubscribe();
  }

  get trainingTabCaption() {
    return this._trainingTabCaption;
  }
}
