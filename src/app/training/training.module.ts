import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared.module';
import { TrainingRoutingModule } from './training-routing.module';
import { TrainingComponent } from './training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { PastTrainingsComponent } from './past-trainings/past-trainings.component';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { StatusPipe } from './status.pipe';
import { StopTrainingDialogComponent } from './current-training/stop-training-dialog/stop-training-dialog.component';
import trainingReducer from './store/training.reducer';

@NgModule({
  declarations: [TrainingComponent, NewTrainingComponent, PastTrainingsComponent, CurrentTrainingComponent, StatusPipe, StopTrainingDialogComponent],
  imports: [
    SharedModule,
    TrainingRoutingModule,
    // NgRx for lazy loaded modules
    StoreModule.forFeature('training', trainingReducer)
  ],
  entryComponents: [StopTrainingDialogComponent]
})
export class TrainingModule { }
