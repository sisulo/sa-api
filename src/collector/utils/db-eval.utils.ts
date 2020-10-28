export class DbEvalUtils {
  public static coalesce(...values: any[]): any {
    return values.find(value => value !== undefined && value !== null);
  }
}