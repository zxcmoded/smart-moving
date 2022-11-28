import { nameof } from 'app/core/nameof';

const getProp = (obj: any, name: string) => {
  const parts = name.split('.');

  let current = obj;

  for (const part of parts) {
    const value = current[part];

    if (value === null) {
      return value;
    }

    current = value;
  }

  return current;
};

export const sortBy = (propName: string, lowerCase?: boolean) => (a, b) => {
  let aValue = getProp(a, propName);
  let bValue = getProp(b, propName);

  if (lowerCase) {
    aValue = aValue?.toLocaleLowerCase ? aValue.toLocaleLowerCase() : null;
    bValue = bValue?.toLocaleLowerCase ? bValue.toLocaleLowerCase() : null;
  }

  const isAValueNothing = aValue === null || aValue === undefined;
  const isBValueNothing = bValue === null || bValue === undefined;

  if (isAValueNothing && !isBValueNothing) {
    return -1;
  } else if (!isAValueNothing && isBValueNothing) {
    return 1;
  } else if (isAValueNothing && isBValueNothing) {
    return 0;
  }

  if (aValue > bValue) {
    return 1;
  } else if (aValue === bValue) {
    return 0;
  } else {
    return -1;
  }
};

export const sortByDescending = (propName: string, lowerCase?: boolean) => (a, b) => {
  let aValue = getProp(a, propName);
  let bValue = getProp(b, propName);

  if (lowerCase) {
    aValue = aValue?.toLocaleLowerCase ? aValue.toLocaleLowerCase() : null;
    bValue = bValue?.toLocaleLowerCase ? bValue.toLocaleLowerCase() : null;
  }

  const isAValueNothing = aValue === null || aValue === undefined;
  const isBValueNothing = bValue === null || bValue === undefined;

  if (isAValueNothing && !isBValueNothing) {
    return 1;
  } else if (!isAValueNothing && isBValueNothing) {
    return -1;
  } else if (isAValueNothing && isBValueNothing) {
    return 0;
  }

  if (aValue > bValue) {
    return -1;
  } else if (aValue === bValue) {
    return 0;
  } else {
    return 1;
  }
};

// Following pattern from https://stackoverflow.com/questions/12802383/extending-array-in-typescript
declare global {
  interface Array<T> {
    sortBy(name: ((obj: T) => any) | (new (...params: any[]) => T), lowerCase?: boolean): Array<T>;

    sortByDescending(name: ((obj: T) => any) | (new (...params: any[]) => T), lowerCase?: boolean): Array<T>;
  }
}

if (!Array.prototype.sortBy) {
  Array.prototype.sortBy = function <T>(this: T[], name: ((obj: T) => any) | (new (...params: any[]) => T), lowerCase?: boolean): T[] {
    return this.sort(sortBy(nameof(name), lowerCase));
  };
}

if (!Array.prototype.sortByDescending) {
  Array.prototype.sortByDescending = function <T>(this: T[], name: ((obj: T) => any) | (new (...params: any[]) => T), lowerCase?: boolean): T[] {
    return this.sort(sortByDescending(nameof(name), lowerCase));
  };
}
