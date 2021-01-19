import { GraphDataDto } from '../models/dtos/graph-data.dto';
import { GraphSerie } from '../models/dtos/graph-serie.dto';
import { TypeMappingUtils } from '../utils/type-mapping.utils';

export class GraphDataTransformer {

  static async transform(dataPromise: Promise<any[]>) {
    const resultDto = new GraphDataDto();
    const data = await dataPromise;

    resultDto.data = data.map(
      serie => {
        const serieDto = new GraphSerie();
        serieDto.type = TypeMappingUtils.resolveMetricType(serie.type);
        serieDto.data = serie.data.map(item => {
          return { x: item.date, y: parseFloat(this.formatNumber(item.value)) };
        });
        return serieDto;
      },
    );
    return resultDto;
  }

  static formatNumber(value) {
    return value != null ? value.toFixed(2) : 0;
  }
}
