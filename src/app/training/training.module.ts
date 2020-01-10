import { NgModule } from '@angular/core';

import { SharedModule } from '../shared.module';
import { TrainingRoutingModule } from './training-routing.module';
import { TrainingComponent } from './training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { PastTrainingsComponent } from './past-trainings/past-trainings.component';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { StatusPipe } from './status.pipe';
import { StopTrainingDialogComponent } from './current-training/stop-training-dialog/stop-training-dialog.component';

@NgModule({
  declarations: [TrainingComponent, NewTrainingComponent, PastTrainingsComponent, CurrentTrainingComponent, StatusPipe, StopTrainingDialogComponent],
  imports: [SharedModule, TrainingRoutingModule],
  entryComponents: [StopTrainingDialogComponent]
})
export class TrainingModule { }
