import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidDate(validationOptions?: ValidationOptions) {
  return (object: any, name: string) => {
    registerDecorator({
      name: 'isValidDate',
      target: object.constructor,
      propertyName: name,
      options: validationOptions,
      validator: {
        validate(value: string) {
          const regExp = new RegExp(/^\d{4}[-]\d{2}[-]\d{2}$/);
          const matched = regExp.test(value);
          if (matched) {
            const today = new Date();
            const isoToday = [today.getFullYear(), today.getMonth(), today.getDay()].join('-'); // 'YYYY-MM-DD'
            return value <= isoToday && !isNaN(new Date(value).getDay());
          }
          return false;
        },
      },
    });
  };
}
