import { describe, test, expect, beforeAll, jest } from '@jest/globals';
import Block from '../src/lib/block';
import BlockInfo from '../src/lib/blockInfo';
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';
import TransactionInput from '../src/lib/transactionInput';
import Wallet from '../src/lib/wallet';

describe("TransactionInput tests", () => {

    let alice : Wallet;

    beforeAll(() => {
        alice = new Wallet();
    })

    test('Should be valid', () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey,
        } as TransactionInput)
        txInput.sign(alice.privateKey);

        const valid = txInput.isValid();
        expect(valid.success).toBeTruthy();
    })
    
})