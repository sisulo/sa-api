export class DbEvalUtils {
  public static coalesce(...values: any[]): any {
    return values.filter(value => value !== undefined && value !== null)
      .pop();
  }
}