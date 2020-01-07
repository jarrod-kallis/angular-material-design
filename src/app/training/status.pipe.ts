import { Pipe, PipeTransform } from '@angular/core';
import { ExerciseStatus } from './exercise.model';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: ExerciseStatus): string {
    switch (value) {
      case ExerciseStatus.Busy: return 'Busy'
      case ExerciseStatus.Cancelled: return 'Cancelled'
      case ExerciseStatus.Completed: return 'Completed'
      case ExerciseStatus.NotStarted: return 'Not Started'
      default: return '';
    }
  }

}
