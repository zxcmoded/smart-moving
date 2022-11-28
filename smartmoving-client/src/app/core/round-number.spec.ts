import { round } from 'app/core/round-number';

describe('round function', () => {

  describe('when rounding an exponent number with default (2) precision', () => {

    it('should properly round the value', () => {
      expect(round(2.2737367544323206e-13)).toEqual(0);
    });
  });

  describe('when rounding a non-exponent number with default (2) precision', () => {

    it('should properly round negative numbers up', () => {
      expect(round(-30.37999999999988)).toEqual(-30.38);
    });

    it('should properly round negative numbers down', () => {
      expect(round(-30.3739999999)).toEqual(-30.37);
    });

    it('should properly round positive numbers up', () => {
      expect(round(30.37999999999988)).toEqual(30.38);
    });

    it('should properly round positive numbers down', () => {
      expect(round(30.3739999999)).toEqual(30.37);
    });
  });

  describe('when rounding a number with non-default precision', () => {

    it('should properly round down', () => {
      expect(round(30.3733399999, 4)).toEqual(30.3733);
    });

    it('should properly round up', () => {
      expect(round(30.3733999999, 4)).toEqual(30.3734);
    });
  });
});
