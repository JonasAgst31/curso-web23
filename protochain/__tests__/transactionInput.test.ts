import { describe, test, expect, beforeAll, jest } from '@jest/globals';
import TransactionInput from '../src/lib/transactionInput';
import Wallet from '../src/lib/wallet';
import TransactionOutput from '../src/lib/transactionOutput';

describe("TransactionInput tests", () => {

    const exampleTx: string = "2b7e4ca0fe162ae6fa4a25166c59ff706fa94687c1a6c9cd53feaff8171f3c7c";
    let alice: Wallet, bob: Wallet;

    beforeAll(() => {
        alice = new Wallet();
        bob = new Wallet();
    })

    test('Should be valid', () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey,
            previousTx: "abc"
        } as TransactionInput)
        txInput.sign(alice.privateKey);

        const valid = txInput.isValid();
        expect(valid.success).toBeTruthy();
    })

    test('Should NOT be valid (defaults)', () => {
        const txInput = new TransactionInput();
        txInput.sign(alice.privateKey);

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();
    })

    test('Should NOT be valid (empty signature)', () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey,
            previousTx: "abc"
        } as TransactionInput)

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();
    })

    test('Should NOT be valid (negative amount)', () => {
        const txInput = new TransactionInput({
            amount: -10,
            fromAddress: alice.publicKey,
            previousTx: "abc"
        } as TransactionInput)
        txInput.sign(alice.privateKey);

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();
    })

    test('Should NOT be valid (invalid signature)', () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey,
            previousTx: "abc"
        } as TransactionInput)
        txInput.sign(bob.privateKey);

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();
    })

    test('Should NOT be valid (invalid previous tx)', () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey
        } as TransactionInput)
        txInput.sign(alice.privateKey);

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();
    })

    test('Should create from TXO', () => {
        const txi = TransactionInput.fromTxo({
            amount: 10,
            toAddress: alice.publicKey,
            tx: exampleTx
        } as TransactionOutput);
        txi.sign(alice.privateKey);

        txi.amount = 11;
        const result = txi.isValid();
        expect(result.success).toBeFalsy();
    })

})