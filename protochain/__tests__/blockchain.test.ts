import { describe, test, expect, jest } from '@jest/globals';
import Blockchain from '../src/lib/blockchain';
import Block from '../src/lib/block';
import Transaction from '../src/lib/transaction';

jest.mock('../src/lib/block');
jest.mock('../src/lib/transaction');

describe("Blockchain tests", () => {

    test('Should has genesis blocks', () => {
        const blockchain = new Blockchain();
        expect(blockchain.blocks.length).toEqual(1);
    })

    test('Should be valid (genesis)', () => {
        const blockchain = new Blockchain();
        expect(blockchain.isValid().success).toBeTruthy();
    })

    test('Should be valid (two blocks)', () => {
        const blockchain = new Blockchain();
        blockchain.addBlock(new Block({
            index: 1,
            previousHash: blockchain.blocks[0].hash,
            transactions: [new Transaction({
                data: "Block 2"
            } as Transaction)]
        } as Block));
        expect(blockchain.isValid().success).toBeTruthy();
    })

    test('Should NOT be valid', () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({
            data: "tx1"
        } as Transaction);
        blockchain.mempool.push(tx);

        blockchain.addBlock(new Block({
            index: 1,
            previousHash: blockchain.blocks[0].hash,
            transactions: [tx]
        } as Block));

        blockchain.blocks[1].index = -1;

        expect(blockchain.isValid().success).toBeFalsy();
    })

    test('Should add transaction', () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({
            data: "tx1",
            hash: "xyz"
        } as Transaction);

        const validation = blockchain.addTransaction(tx);

        expect(validation.success).toBeTruthy();
    })

    test('Should NOT add transaction (invalid data)', () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({
            data: "",
            hash: "xyz"
        } as Transaction);

        const validation = blockchain.addTransaction(tx);
        expect(validation.success).toBeFalsy();
    })

    test('Should NOT add transaction (duplicated tx in blockchain)', () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({
            data: "tx1",
            hash: "xyz"
        } as Transaction);

        blockchain.blocks.push(new Block({
            transactions: [tx]
        } as Block));

        const validation = blockchain.addTransaction(tx);
        expect(validation.success).toBeFalsy();
    })

    test('Should NOT add transaction (duplicated tx in mempool)', () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({
            data: "tx1",
            hash: "xyz"
        } as Transaction);

        blockchain.mempool.push(tx);

        const validation = blockchain.addTransaction(tx);
        expect(validation.success).toBeFalsy();
    })

    test('Should get block', () => {
        const blockchain = new Blockchain();
        const block = blockchain.getBlock(blockchain.blocks[0].hash);
        expect(block).toBeTruthy();
    })

    test('Should get transaction (mempool)', () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({
            data: "tx1",
            hash: "xyz"
        } as Transaction);

        blockchain.mempool.push(tx);

        const result = blockchain.getTransaction("xyz");

        expect(result.mempoolIndex).toEqual(0);
    })

    test('Should get transaction (blockchain)', () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({
            data: "tx1",
            hash: "xyz"
        } as Transaction);

        blockchain.blocks.push(new Block({
            transactions: [tx]
        } as Block));

        const result = blockchain.getTransaction("xyz");

        expect(result.blockIndex).toEqual(1);
    })

    test('Should NOT get transaction', () => {
        const blockchain = new Blockchain();
        const result = blockchain.getTransaction("xyz");
        expect(result.blockIndex).toEqual(-1);
        expect(result.mempoolIndex).toEqual(-1);
    })

    test('Should add block', () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({
            data: "tx1"
        } as Transaction);
        blockchain.mempool.push(tx);

        const result = blockchain.addBlock(new Block({
            index: 1,
            previousHash: blockchain.blocks[0].hash,
            transactions: [tx]
        } as Block));
        expect(result.success).toBeTruthy();
    })

    test('Should NOT add block', () => {
        const blockchain = new Blockchain();
        const block = new Block({
            index: -1,
            previousHash: blockchain.blocks[0].hash,
            transactions: [new Transaction({
                data: "Block 2"
            } as Transaction)]
        } as Block);
        const result = blockchain.addBlock(block);
        expect(result.success).toBeFalsy();
    })

    test('Should get next block info', () => {
        const blockchain = new Blockchain();
        blockchain.mempool.push(new Transaction());

        const info = blockchain.getNextBlock();
        expect(info ? info.index : 0).toEqual(1);
    })

    test('Should NOT get next block info', () => {
        const blockchain = new Blockchain();
        const info = blockchain.getNextBlock();
        expect(info).toBeNull();
    })

})