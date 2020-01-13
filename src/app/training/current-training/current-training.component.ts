import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { TrainingService } from '../training.service';
import { StopTrainingDialogComponent } from './stop-training-dialog/stop-training-dialog.component';
import { Exercise } from '../exercise.model';
import * as fromTraining from '../store/training.reducer';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit, OnDestroy {
  @Input() exercise: Exercise;

  exerciseProgressPercentage: number = 0;
  private exerciseProgressPercentageChangedSubscription: Subscription;

  constructor(
    private trainingService: TrainingService,
    private dialog: MatDialog,
    private store: Store<fromTraining.State>
  ) { }

  ngOnInit() {
    this.exerciseProgressPercentageChangedSubscription = this.store.select(fromTraining.getExerciseProgressPercentage)
      .subscribe((percentage: number) => this.exerciseProgressPercentage = percentage);
  }

  ngOnDestroy() {
    this.exerciseProgressPercentageChangedSubscription.unsubscribe();
  }

  stopClick() {
    this.trainingService.pauseExercise();

    const dialogRef = this.dialog.open(StopTrainingDialogComponent,
      { data: { progress: this.exerciseProgressPercentage } });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.trainingService.cancelExercise();
      } else {
        this.trainingService.resumeExercise()
      }
    });
  }
}
