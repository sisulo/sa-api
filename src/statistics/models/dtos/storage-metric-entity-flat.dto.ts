import { StorageEntityMetricDto } from './storage-metric-entity-hierarchy.dto';
import { ExternalResponseDto } from '../../../collector/dto/external-response.dto';
import { SystemMetric } from '../metrics/SystemMetric';

export class StorageMetricEntityFlatDto implements StorageEntityMetricDto {

  externals: ExternalResponseDto[];
  id: number;
  metrics: SystemMetric[];
  name: string;
  referenceId: string;
  status: string;
  type: string;
  parent: StorageMetricEntityFlatDto;
}
