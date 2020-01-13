import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Exercise, ExerciseStatus } from '../exercise.model';
import { TrainingService } from '../training.service';
import * as fromTraining from '../store/training.reducer';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['startDate', 'endDate', 'name', 'duration', 'calories', 'status'];
  dataSource = new MatTableDataSource<Exercise>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  private attemptedExercisesChangedSubscription: Subscription;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>
  ) { }

  ngOnInit() {
    // console.log('PastTraining OnInit');
    this.dataSource.data = [];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.filterPredicate;

    this.trainingService.fetchAttemptedExercises();
    this.attemptedExercisesChangedSubscription = this.store.select(fromTraining.getAttemptedExercises)
      .subscribe((attemptedExercises: Exercise[]) => {
        this.dataSource.data = attemptedExercises;
      });
  }

  ngOnDestroy() {
    // console.log('PastTraining OnDestroy');
    this.attemptedExercisesChangedSubscription.unsubscribe();
  }

  filterPredicate(data: Exercise, filterValue: string): boolean {
    let foundIdx: number = -1;

    foundIdx = data.name.trim().toLowerCase().indexOf(filterValue);
    if (foundIdx === -1) {
      foundIdx = ("" + data.duration).indexOf(filterValue);
    }
    if (foundIdx === -1) {
      foundIdx = ("" + data.calories).indexOf(filterValue);
    }
    if (foundIdx === -1) {
      foundIdx = ExerciseStatus[data.status].trim().toLowerCase().indexOf(filterValue);
    }
    if (foundIdx === -1) {
      foundIdx = ("" + data.startDate).trim().toLowerCase().indexOf(filterValue);
    }
    if (foundIdx === -1 && data.endDate) {
      foundIdx = ("" + data.endDate).trim().toLowerCase().indexOf(filterValue);
    }

    // console.log(data, filterValue, foundIdx);
    // const exerciseConcat: string = (data.id + data.name + data.duration + data.calories + ExerciseStatus[data.status] + data.startDate + data.endDate).trim().toLowerCase();
    // console.log(exerciseConcat, exerciseConcat.indexOf(filterValue));

    // return exerciseConcat.indexOf(filterValue) > -1;
    return foundIdx > -1;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
