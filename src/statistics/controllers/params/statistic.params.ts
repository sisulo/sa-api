import { IsNumberString } from 'class-validator';

export class StatisticParams {
  @IsNumberString({ message: 'Value \'$value\' is not valid ID of datacenter. It must be number.' })
  idDataCenter: number;

}
