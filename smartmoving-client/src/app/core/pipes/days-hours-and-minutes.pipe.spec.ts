import { nameof } from '../nameof';
import { DaysHoursAndMinutesPipe } from 'app/core/pipes/days-hours-and-minutes.pipe';

describe(nameof(DaysHoursAndMinutesPipe), () => {
  let sut: DaysHoursAndMinutesPipe;

  beforeEach(() => {
    sut = new DaysHoursAndMinutesPipe();
  });

  it('should create an instance', () => {
    expect(sut).toBeTruthy();
  });

  it('should return expected formatted time', () => {
    const time = 2970;
    expect(sut.transform(time)).toEqual('2d 1h 30m');
  });

  it('should return expected formatted time without zero components', () => {
    const time = 1440;
    expect(sut.transform(time)).toEqual('1d');
  });

  it('should return expected formatted time without zero components', () => {
    const time = 120;
    expect(sut.transform(time)).toEqual('2h');
  });

  it('should return expected formatted time without zero components', () => {
    const time = 30;
    expect(sut.transform(time)).toEqual('30m');
  });

  it('should return expected formatted time without zero components', () => {
    const time = 1450;
    expect(sut.transform(time)).toEqual('1d 10m');
  });

  it('should return expected formatted time without zero components', () => {
    const time = 1440 + 60;
    expect(sut.transform(time)).toEqual('1d 1h');
  });

  it('should return whole number rounded up when time has decimals', () => {
    const time = 0.221231;
    expect(sut.transform(time)).toEqual('1m');
  });

  it('should return whole number rounded up when time has decimals', () => {
    const time = 20.221231;
    expect(sut.transform(time)).toEqual('21m');
  });

  it('should return whole number rounded up when time has decimals', () => {
    const time = 1440 + 20.2;
    expect(sut.transform(time)).toEqual('1d 21m');
  });

  it('should return whole number rounded up when time has decimals', () => {
    const time = 1440 + 120 + 30.7;
    expect(sut.transform(time)).toEqual('1d 2h 31m');
  });

  it('should return "--" when time is null', () => {
    const time = null;
    expect(sut.transform(time)).toEqual('--');
  });

  it('should return "--" when time is empty', () => {
    const time = '';
    expect(sut.transform(time)).toEqual('--');
  });

  it('should return "--" when time is zero', () => {
    const time = 0;
    expect(sut.transform(time)).toEqual('--');
  });

  it('should return "--" when time is not a number', () => {
    const time = 'test';
    expect(sut.transform(time)).toEqual('--');
  });

  it('should return "0h" when time is not a number and dashes disabled', () => {
    const time = 'test';
    expect(sut.transform(time, false)).toEqual('0h');
  });

  it('should return "0m" when time is not a number and custom string passed in', () => {
    const time = 'test';
    expect(sut.transform(time, 'm')).toEqual('0m');
  });
});
