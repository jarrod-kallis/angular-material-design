import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import * as fromRoot from '../../app.reducer';
import * as fromTraining from '../store/training.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  formGroup: FormGroup;
  availableExercises$: Observable<Exercise[]>;

  exerciseStarted$: Observable<boolean>;
  isLoading$: Observable<boolean>;

  constructor(private trainingService: TrainingService, private store: Store<fromTraining.State>) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      'exercise': new FormControl('', [Validators.required])
    });

    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    this.fetchAvailableExercises();

    this.availableExercises$ = this.store.select(fromTraining.getAvailableExercises);
    this.exerciseStarted$ = this.store.select(fromTraining.getExerciseStarted);
  }

  onSubmit() {
    this.trainingService.startExercise(this.formGroup.value.exercise);
  }

  fetchAvailableExercises() {
    this.trainingService.fetchAvailableExercises();
  }
}
