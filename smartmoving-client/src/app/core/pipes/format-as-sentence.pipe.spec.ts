import { nameof } from '../nameof';
import { FormatAsSentencePipe } from 'app/core/pipes/format-as-sentence.pipe';

describe(nameof(FormatAsSentencePipe), () => {
  let sut: FormatAsSentencePipe;

  beforeEach(() => {
    sut = new FormatAsSentencePipe();
  });

  it('should create an instance', () => {
    expect(sut).toBeTruthy();
  });

  it('should return the value if falsy', () => {
    expect(sut.transform('')).toEqual('');
  });

  it('should uppercase the first character if not already', () => {
    expect(sut.transform('test me.')).toEqual('Test me.');
  });

  it('should not touch the first character if already uppercase', () => {
    expect(sut.transform('Test me.')).toEqual('Test me.');
  });

  it('should add period to end if not present', () => {
    expect(sut.transform('Test me')).toEqual('Test me.');
  });

  it('should not add ending punctuation if ends with period', () => {
    expect(sut.transform('Test me.')).toEqual('Test me.');
  });

  it('should not add ending punctuation if ends with exclamation point', () => {
    expect(sut.transform('Test me!')).toEqual('Test me!');
  });

  it('should not add ending punctuation if ends with question mark', () => {
    expect(sut.transform('Test me?')).toEqual('Test me?');
  });
});
