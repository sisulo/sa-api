import { PeriodType } from '../../../collector/enums/period-type.enum';
export enum OutputType {
  FLAT= 'FLAT',
  HIERARCHY = 'HIERARCHY',
}
export class StatisticQueryParams {
  // @IsValidDate({ message: 'Date \'$value\' is not valid value of query param \'date\'' })
  date: Date;
  period: PeriodType;
  metricFilter: string[];
  orderBy: string[];
  serialNumber: string[];
  tier: string[];
  output: OutputType = OutputType.FLAT;
}
