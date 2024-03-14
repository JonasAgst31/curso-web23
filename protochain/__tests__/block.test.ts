import Block from '../src/lib/block';

describe("Block tests", () => {

    test('Should be valid', () => {
        const block = new Block(1, "abc");
        const valid = block.isValid();
        expect(valid).toBeTruthy();
    })

    test('Should NOT be valid', () => {
        const block = new Block(1, "");
        const valid = block.isValid();
        expect(valid).toBeFalsy();
    })

    test('Should NOT be valid', () => {
        const block = new Block(-1, "abc");
        const valid = block.isValid();
        expect(valid).toBeFalsy();
    })

})