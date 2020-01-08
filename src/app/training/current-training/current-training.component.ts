import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

import { TrainingService } from '../training.service';
import { StopTrainingDialogComponent } from './stop-training-dialog/stop-training-dialog.component';
import { Exercise } from '../exercise.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit, OnDestroy {
  @Input() exercise: Exercise;

  exerciseProgressPercentage: number = this.trainingService.exerciseProgressPercentage;
  private exerciseProgressPercentageChangedSubscription: Subscription;

  constructor(private trainingService: TrainingService, private dialog: MatDialog) { }

  ngOnInit() {
    this.exerciseProgressPercentageChangedSubscription = this.trainingService.onExerciseProgressPercentageChanged
      .subscribe((exerciseProgressPercentage: number) => {
        this.exerciseProgressPercentage = exerciseProgressPercentage;
      });
  }

  ngOnDestroy() {
    this.exerciseProgressPercentageChangedSubscription.unsubscribe();
  }

  stopClick() {
    this.trainingService.pauseExercise();

    const dialogRef = this.dialog.open(StopTrainingDialogComponent,
      { data: { progress: this.trainingService.exerciseProgressPercentage } });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.trainingService.cancelExercise();
      } else {
        this.trainingService.resumeExercise()
      }
    });
  }
}
