import { ChaMetricResponseDto } from './cha-metric-response.dto';

export class PortMetricResponseDto extends ChaMetricResponseDto {
  idPort: number;
  portName: string;
}
