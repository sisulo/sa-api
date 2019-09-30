import { AlertType } from './AlertType';
import { Occurrence } from './Occurrence';

export class Alert {
  type: AlertType;
  occurrences: Occurrence[];
}
