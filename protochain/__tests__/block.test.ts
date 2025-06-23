import { describe, test, expect, beforeAll, jest } from '@jest/globals';
import Block from '../src/lib/block';
import BlockInfo from '../src/lib/blockInfo';
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';

jest.mock('../src/lib/transaction');

describe("Block tests", () => {

    const exampleDifficulty = 0;
    const exampleMiner = "miner";
    let genesis: Block;

    beforeAll(() => {
        genesis = new Block({
            transactions: [new Transaction({
                data: "Genesis block"
            } as Transaction)]
        } as Block);
    })

    test('Should be valid', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [new Transaction({
                data: "Block 2"
            } as Transaction)]
        } as Block);
        block.mine(exampleDifficulty, exampleMiner);

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeTruthy();
    })

    test('Should create from block info', () => {
        const block = Block.fromBlockInfo({
            transactions: [new Transaction({
                data: "Block 2"
            } as Transaction)],
            difficulty: exampleDifficulty,
            feePerTx: 1,
            index: 1,
            maxDifficulty: 62,
            previousHash: genesis.hash
        } as BlockInfo);
        block.mine(exampleDifficulty, exampleMiner);

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeTruthy();
    })

    test('Should NOT be valid (2 FEE)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [
                new Transaction({
                    data: "fee1",
                    type: TransactionType.FEE
                } as Transaction),

                new Transaction({
                    data: "fee2",
                    type: TransactionType.FEE
                } as Transaction)]
        } as Block);
        block.mine(exampleDifficulty, exampleMiner);

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test('Should NOT be valid (invalid tx)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [new Transaction()]
        } as Block);
        block.mine(exampleDifficulty, exampleMiner);

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test('Should NOT be valid (fallbacks)', () => {
        const block = new Block();
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test('Should NOT be valid (previous hash)', () => {
        const block = new Block({
            index: 1,
            previousHash: "abc",
            transactions: [new Transaction({
                data: "Block 3"
            } as Transaction)]
        } as Block);
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toEqual("Invalid previous hash.");
    })

    test('Should NOT be valid (index)', () => {
        const block = new Block({
            index: -1,
            previousHash: genesis.hash,
            transactions: [new Transaction({
                data: "Block 2"
            } as Transaction)]
        } as Block);
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test('Should NOT be valid (empty hash)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [new Transaction({
                data: "Block 2"
            } as Transaction)]
        } as Block);
        block.mine(exampleDifficulty, exampleMiner);

        block.hash = "";

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toEqual("Invalid hash.");
    })

    test('Should NOT be valid (no mined)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [new Transaction({
                data: "Block 2"
            } as Transaction)]
        } as Block);

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toEqual("No mined.");
    })

    test('Should NOT be valid (timestamp)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [new Transaction({
                data: "Block 2"
            } as Transaction)]
        } as Block);
        block.timestamp = -1;
        block.hash = block.getHash();
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test('Should NOT be valid (data)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [new Transaction({
                data: ""
            } as Transaction)]
        } as Block);
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

})