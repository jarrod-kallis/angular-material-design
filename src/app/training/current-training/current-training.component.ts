import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit, OnDestroy {
  @Input() exercise: string;

  clearProgressTimer: NodeJS.Timer;
  progressPercentage: number = 0;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.clearProgressTimer = setInterval(() => {
      this.progressPercentage = Math.ceil(this.progressPercentage + (1 / 60 * 100));
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.clearProgressTimer);
  }

  stopClick() {
    this.trainingService.stopTraining();
  }
}
