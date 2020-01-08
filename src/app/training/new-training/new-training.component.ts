import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  availableExercises: Exercise[] = [];

  exerciseStarted: boolean = false;

  private exerciseStatusChangedSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      'exercise': new FormControl('', [Validators.required])
    });

    this.availableExercises = this.trainingService.availableExercises;

    this.exerciseStatusChangedSubscription = this.trainingService.onExerciseStatusChanged
      .subscribe(() => {
        this.exerciseStarted = this.trainingService.exerciseStarted;
      });
  }

  ngOnDestroy() {
    this.exerciseStatusChangedSubscription.unsubscribe()
  }

  onSubmit() {
    this.trainingService.startExercise(this.formGroup.value.exercise);
  }
}
