export class ValidateResponseUtils {
  public static validateResponse(response, expected) {
    // console.log(response);
    expect(response.body).toEqual(expected);
  }
}
