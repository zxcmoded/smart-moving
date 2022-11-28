import { nameof } from '../nameof';
import { SmCurrencyPipe } from 'app/core/pipes/sm-currency.pipe';


describe(nameof(SmCurrencyPipe), () => {
  let sut: SmCurrencyPipe;

  beforeEach(() => {
    sut = new SmCurrencyPipe();
  });

  it('should create an instance', () => {
    expect(sut).toBeTruthy();
  });

  it('should return formatted value', () => {
    expect(sut.transform(150)).toEqual('$150.00');
  });

  it('should return formatted value without cents', () => {
    expect(sut.transform(150, false)).toEqual('$150');
  });

  it('should return formatted negative value', () => {
    expect(sut.transform(-150)).toEqual('-$150.00');
  });

  it('should return formatted negative value inside parenthesis', () => {
    expect(sut.transform(-150, true, null, true)).toEqual('($150.00)');
  });

  it('should return dashes', () => {
    expect(sut.transform(0)).toEqual('--');
  });

  it('should formatted zero', () => {
    expect(sut.transform(0, true, null, false, true)).toEqual('$0.00');
  });
});
