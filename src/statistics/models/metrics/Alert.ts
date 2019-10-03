import { AlertType } from './AlertType';
import { Occurrence } from './Occurrence';

export class Alert {
  type: AlertType;
  minValue: number;
  maxValue: number;
  unit: string;
  occurrences: Occurrence[];
}
