export interface ErrorCode {
  code: number;
  message: string;
}

export class ErrorCodeConst {
  static ENTITY_NOT_FOUND = { code: 1000, message: 'Entity not found' };
  static HTTP_ERROR = { code: 8000, message: 'HTTP error' };
  static UNKNOWN_ERROR = { code: 9000, message: 'Unrecognized error happened' };

}
