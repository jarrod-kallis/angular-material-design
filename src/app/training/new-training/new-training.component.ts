import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { GuiService } from '../../shared/services/gui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  availableExercises: Exercise[] = [];

  exerciseStarted: boolean = false;
  isLoading: boolean = false;

  private loadingChangedSubscription: Subscription;
  private exerciseStatusChangedSubscription: Subscription;
  private availableExercisesChangedSubscription: Subscription;

  constructor(private trainingService: TrainingService, private guiService: GuiService) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      'exercise': new FormControl('', [Validators.required])
    });

    this.loadingChangedSubscription = this.guiService.onLoadingChangedEvent
      .subscribe((isLoading: boolean) => this.isLoading = isLoading);

    this.availableExercisesChangedSubscription = this.trainingService.onAvailableExercisesChanged
      .subscribe(() => {
        this.availableExercises = this.trainingService.availableExercises;
      });

    this.exerciseStatusChangedSubscription = this.trainingService.onExerciseStatusChanged
      .subscribe(() => {
        this.exerciseStarted = this.trainingService.exerciseStarted;
      });

    this.fetchAvailableExercises();
  }

  ngOnDestroy() {
    this.loadingChangedSubscription.unsubscribe();
    this.exerciseStatusChangedSubscription.unsubscribe()
    this.availableExercisesChangedSubscription.unsubscribe();
  }

  onSubmit() {
    this.trainingService.startExercise(this.formGroup.value.exercise);
  }

  fetchAvailableExercises() {
    this.trainingService.fetchAvailableExercises();
  }
}
