import { SystemMetric } from '../metrics/SystemMetric';
import { ExternalResponseDto } from '../../../collector/dto/external-response.dto';

export class StorageEntityMetricDto {
  id: number;
  name: string;
  type: string;
  status: string;
  serialNumber: string;
  children: StorageEntityMetricDto[];
  metrics: SystemMetric[];
  externals: ExternalResponseDto[];
}
