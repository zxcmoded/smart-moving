import { nameof } from '../nameof';
import { CamelCasePipe } from 'app/core/pipes/camel-case.pipe';

describe(nameof(CamelCasePipe), () => {
  let sut: CamelCasePipe;

  beforeEach(() => {
    sut = new CamelCasePipe();
  });

  it('should create an instance', () => {
    expect(sut).toBeTruthy();
  });

  it('should returns camelCase', () => {
    const str = 'PascalCase';
    expect(sut.transform(str)).toEqual('pascalCase');
  });

  it('should returns camelCase', () => {
    const str = 'Random Text';
    expect(sut.transform(str)).toEqual('randomText');
  });

  it('should returns camelCase', () => {
    const str = `Random's Text`;
    expect(sut.transform(str)).toEqual('randomsText');
  });

  it('should returns camelCase', () => {
    const str = `Random(Text)`;
    expect(sut.transform(str)).toEqual('randomText');
  });

  it('should returns camelCase', () => {
    const str = `Random (Text)`;
    expect(sut.transform(str)).toEqual('randomText');
  });

  it('should returns camelCase', () => {
    const str = 'random-text';
    expect(sut.transform(str)).toEqual('randomText');
  });

  it('should returns camelCase', () => {
    const str = `random DummyText`;
    expect(sut.transform(str)).toEqual('randomDummyText');
  });
});
