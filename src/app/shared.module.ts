import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularMaterialModule } from './angular.material.module';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, AngularMaterialModule, FlexLayoutModule],
  exports: [CommonModule, ReactiveFormsModule, AngularMaterialModule, FlexLayoutModule]
})
export class SharedModule { }
