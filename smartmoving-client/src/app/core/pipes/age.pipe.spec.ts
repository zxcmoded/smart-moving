import { AgePipe } from './age.pipe';
import * as moment from 'moment';
import { nameof } from '../nameof';

describe(nameof(AgePipe), () => {
  let sut: AgePipe;

  beforeEach(() => {
    sut = new AgePipe();
  });

  it('should create an instance', () => {
    expect(sut).toBeTruthy();
  });

  it('should give a nice human readable of time elapsed', () => {
    const now = moment().add(-1, 'day');

    expect(sut.transform(now.format())).toEqual('a day');
  });
});
