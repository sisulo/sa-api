import { SystemMetric } from '../metrics/SystemMetric';
import { ExternalResponseDto } from '../../../collector/dto/external-response.dto';
export interface StorageEntityMetricDto {
  id: number;
  name: string;
  type: string;
  status: string;
  referenceId: string;
  metrics: SystemMetric[];
  externals: ExternalResponseDto[];
}
export class StorageMetricEntityHierarchyDto implements StorageEntityMetricDto {
  id: number;
  name: string;
  type: string;
  status: string;
  referenceId: string;
  children: StorageMetricEntityHierarchyDto[];
  metrics: SystemMetric[];
  externals: ExternalResponseDto[];
}
