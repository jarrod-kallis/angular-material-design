export enum ExerciseStatus {
  NotStarted,
  Busy,
  Cancelled,
  Completed
}

export class Exercise {
  id: string;
  name: string;
  duration: number; // in seconds
  calories: number;
  startDate?: Date;
  endDate?: Date;
  status?: ExerciseStatus;

  constructor(id: string, name: string, duration: number,
    calories: number, status: ExerciseStatus = ExerciseStatus.NotStarted,
    startDate?: Date, endDate?: Date) {
    this.id = id;
    this.name = name;
    this.duration = duration;
    this.calories = calories;
    this.status = status;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  public objectToSave?(): any {
    const { id, ...stuffToSaveToDB } = this;

    // console.log(stuffToSaveToDB);

    return stuffToSaveToDB;
  }
}
