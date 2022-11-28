import { round as mathJsRound } from 'mathjs/lib/esm/number';

/**
 * @deprecated The method should not be used. Use roundDecimal instead.
 */
export const round = (value: number, decimals = 2) => {
  let val: string = value.toString();
  if (!value.toString().includes('e')) {
    val = value + 'e' + decimals;
  }

  return Number(Math.round(Number(val)) + 'e-' + decimals);
};

// this is a wrapper around MathJs which is what should be used moving forward for all rounding
export const roundDecimal = (value: number, decimals = 2) => mathJsRound(value, decimals);
