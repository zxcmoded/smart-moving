import { nameof } from '../nameof';
import { SentenceJoinPipe } from './sentence-join.pipe';

describe(nameof(SentenceJoinPipe), () => {
    let sut: SentenceJoinPipe;

    beforeEach(() => {
        sut = new SentenceJoinPipe();
    });

    it('should create an instance', () => {
        expect(sut).toBeTruthy();
    });

    it('should return the same value', () => {
        expect(sut.transform(1)).toEqual(1);
    });

    it('should return the first value', () => {
        const firstValue = 'first';
        const input = [];
        input.push(firstValue);

        expect(sut.transform(input)).toEqual(firstValue);
    });

    it('should return and value', () => {
        const firstValue = 'first';
        const secondValue = 'second';
        const input = [];
        input.push(firstValue);
        input.push(secondValue);

        expect(sut.transform(input)).toEqual(`${firstValue} and ${secondValue}`);
    });

    it('should return comma seperated values', () => {
        const firstValue = 'first';
        const secondValue = 'second';
        const thirdValue = 'third';
        const input = [];
        input.push(firstValue);
        input.push(secondValue);
        input.push(thirdValue);

        expect(sut.transform(input)).toEqual(`${firstValue}, ${secondValue} and ${thirdValue}`);
    });

    it('should return more comma seperated values', () => {
        const firstValue = 'first';
        const secondValue = 'second';
        const thirdValue = 'third';
        const fourthValue = 'fourth';
        const input = [];
        input.push(firstValue);
        input.push(secondValue);
        input.push(thirdValue);
        input.push(fourthValue);

        expect(sut.transform(input)).toEqual(`${firstValue}, ${secondValue}, ${thirdValue} and ${fourthValue}` );
    });
});
