import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      'exercise': new FormControl('', [Validators.required])
    })
  }

  onSubmit() {
    console.log(this.formGroup.value);
    this.trainingService.startTraining(this.formGroup.value.exercise);
  }
}
