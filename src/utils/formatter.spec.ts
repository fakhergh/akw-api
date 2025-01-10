import { Formatter } from '@/utils/formatter';

const text: string = 'joe';
const expectedText: string = 'Joe';

describe('Formatter', () => {
    it('Should equals expected text', () => {
        expect(Formatter.capitalize(text)).toEqual(expectedText);
    });
});
