import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

import { TrainingService } from '../training.service';
import { StopTrainingDialogComponent } from './stop-training-dialog/stop-training-dialog.component';
import { Exercise, ExerciseStatus } from '../exercise.model';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit, OnDestroy {
  @Input() exercise: Exercise;

  clearProgressTimer: NodeJS.Timer;
  progressPercentage: number = 0;

  constructor(private trainingService: TrainingService, private dialog: MatDialog) { }

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.removeProgressTimer();
  }

  startTimer() {
    this.clearProgressTimer = setInterval(() => {
      this.progressPercentage = Math.ceil(this.progressPercentage + (1 / this.exercise.duration * 100));

      if (this.progressPercentage >= 100) {
        this.progressPercentage = 100;
        this.removeProgressTimer();

        this.trainingService.completeTraining();
      }
    }, 1000);
  }

  removeProgressTimer() {
    clearInterval(this.clearProgressTimer);
  }

  stopClick() {
    this.removeProgressTimer();

    const dialogRef = this.dialog.open(StopTrainingDialogComponent,
      { data: { progress: this.progressPercentage } });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.trainingService.cancelTraining(this.progressPercentage);
      } else {
        this.startTimer();
      }
    });
  }
}
