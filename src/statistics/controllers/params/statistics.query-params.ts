import { IsValidDate } from './is-valid-date.validator';

export class StatisticQueryParams {
  @IsValidDate({ message: 'Date \'$value\' is not valid value of query param \'date\'' })
  date: Date;
}
