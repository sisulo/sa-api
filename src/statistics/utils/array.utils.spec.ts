import { ArrayUtils } from './array.utils';

describe('array.utils', () => {

  it('should return grouped entities', async () => {
    const inputArray = [
      { a: 1, b: 2 },
      { a: 1, b: 3 },
      { a: 2, b: 0 },
    ];
    expect(ArrayUtils.groupBy(inputArray, 'a')).toStrictEqual({
      1: [{ a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      2: [{ a: 2, b: 0 }],
    });
  });
  it('empty input array', async () => {
      const inputArray = [];
      expect(ArrayUtils.groupBy(inputArray, 'a')).toStrictEqual({});
    },
  );
});
