import { PeriodType } from '../../../collector/enums/period-type.enum';

export class StatisticQueryParams {
  // @IsValidDate({ message: 'Date \'$value\' is not valid value of query param \'date\'' })
  date: Date;
  period: PeriodType;
}
