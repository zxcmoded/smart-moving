import { sortBy, sortByDescending } from 'app/core/sort-by-function';

describe('when sorting a list using lower case with non-strings', () => {

  it('does not blow up', () => {
    const myArray = [{ prop: 'b' }, { prop: 'a' }, {}, { prop: 'c' }, { prop: null }, { prop: 5 }];

    expect(myArray.sort(sortBy('prop', true)))
        .toEqual([{}, { prop: null }, { prop: 5 }, { prop: 'a' }, { prop: 'b' }, { prop: 'c' }]);
  });
});

describe('when reverse sorting a list using lower case with non-strings', () => {

  it('does not blow up', () => {
    const myArray = [{ prop: 'b' }, { prop: 'a' }, {}, { prop: 'c' }, { prop: null }, { prop: 5 }];

    expect(myArray.sort(sortByDescending('prop', true)))
        .toEqual([{ prop: 'c' }, { prop: 'b' }, { prop: 'a' }, {}, { prop: null }, { prop: 5 }]);
  });
});
