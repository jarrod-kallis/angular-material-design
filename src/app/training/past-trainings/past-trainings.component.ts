import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';

import { Exercise, ExerciseStatus } from '../exercise.model';
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
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  private exerciseStatusChangedSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.filterPredicate;

    this.exerciseStatusChangedSubscription = this.trainingService.onExerciseStatusChanged
      .subscribe(() => {
        this.dataSource.data = this.trainingService.attemptedExercises;
      })
  }

  ngOnDestroy() {
    this.exerciseStatusChangedSubscription.unsubscribe();
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

    console.log(data, filterValue, foundIdx);
    // const exerciseConcat: string = (data.id + data.name + data.duration + data.calories + ExerciseStatus[data.status] + data.startDate + data.endDate).trim().toLowerCase();
    // console.log(exerciseConcat, exerciseConcat.indexOf(filterValue));

    // return exerciseConcat.indexOf(filterValue) > -1;
    return foundIdx > -1;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
