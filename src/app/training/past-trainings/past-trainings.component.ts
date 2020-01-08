import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['startDate', 'name', 'duration', 'calories', 'status'];
  dataSource = new MatTableDataSource<Exercise>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private exerciseStatusChangedSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;

    this.exerciseStatusChangedSubscription = this.trainingService.onExerciseStatusChanged
      .subscribe(() => {
        this.dataSource.data = this.trainingService.attemptedExercises;
      })
  }

  ngOnDestroy() {
    this.exerciseStatusChangedSubscription.unsubscribe();
  }
}
