import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TrainingComponent } from './training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { PastTrainingsComponent } from './past-trainings/past-trainings.component';
import { CurrentTrainingComponent } from './current-training/current-training.component';

const routes: Routes = [
  {
    path: '', component: TrainingComponent,
    children: [
      { path: 'new', component: NewTrainingComponent },
      { path: 'past', component: PastTrainingsComponent },
      { path: 'current', component: CurrentTrainingComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }
