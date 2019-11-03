import { GraphDataDto } from './models/dtos/graph-data.dto';
import { GraphSerie } from './models/dtos/graph-serie.dto';

export class GraphDataTransformer {
  static async transform(dataPromise: Promise<any[]>) {
    const resultDto = new GraphDataDto();
    const data = await dataPromise;
    resultDto.data = data.map(
      serie => {
        const serieDto = new GraphSerie();
        serieDto.type = serie.type;
        serieDto.data = serie.data;
        return serieDto;
      },
    );
    return resultDto;
  }
}
