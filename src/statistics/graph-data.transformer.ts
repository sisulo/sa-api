import { GraphDataDto } from './models/dtos/graph-data.dto';
import { GraphSerie } from './models/dtos/graph-serie.dto';
import { TypeMappingUtils } from './utils/type-mapping.utils';

export class GraphDataTransformer {

  static async transform(dataPromise: Promise<any[]>) {
    const resultDto = new GraphDataDto();
    const data = await dataPromise;
    const pipe = new Date();
    resultDto.data = data.map(
      serie => {
        const serieDto = new GraphSerie();
        serieDto.type = TypeMappingUtils.resolveMetricType(serie.type);
        serieDto.data = serie.data.map(item => {
          return { x: item.date, y: parseFloat(item.value.toFixed(2)) };
        });
        return serieDto;
      },
    );
    return resultDto;
  }
}
