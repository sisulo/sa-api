import { OrderByVo } from './order-by.vo';
import { MetricFilterError } from '../../services/metric-filter.error';
import { MetricType } from '../../../collector/enums/metric-type.enum';
import { OrderByDirection } from '../sort-storage-entity-by-metric.utils';

export class OrderByUtils {
  public static parseOrderBy(orderBy: string[]): OrderByVo[] {
    return orderBy.map(orderByItem =>
      this.parseOrderByItem(orderByItem),
    );
  }

  private static parseOrderByItem(orderByItem: string): OrderByVo {
    const parts = orderByItem.split(' ');
    if (parts.length !== 2) {
      throw new MetricFilterError(`Wrong order by definitin: '${orderByItem}'. Specify 'metric name' and order by direction(ASC, DESC).`);
    }
    const metricType = MetricType[parts[0].toUpperCase()];
    if (metricType === undefined) {
      throw new MetricFilterError(`Unknown metric type: '${parts[0]}`);
    }

    const orderByDirection = OrderByDirection[parts[1].toUpperCase()];
    if (orderByDirection === undefined) {
      throw new MetricFilterError(`Unknown order by direction: '${parts[1]}'`);
    }
    return {
      type: metricType,
      direction: orderByDirection,
    };
  }
}
