import { Tx } from '../types';
import { ChainXSHelper, Wallet } from '../utils';

test('Test hash', async () => {
    const tx = new Tx();
    tx.version = '1.0';
    tx.chain = "mainnet";
    tx.validator = ["validator1", "validator2"];
    tx.from = ["fromAddress1", "fromAddress2"];
    tx.debit = [Buffer.from("100", 'utf-8').toString('base64'), Buffer.from("200", 'utf-8').toString('base64')];
    tx.to = ["toAddress1", "toAddress2"];
    tx.amount = [Buffer.from("100", 'utf-8').toString('base64'), Buffer.from("200", 'utf-8').toString('base64')];
    tx.type = 1;
    tx.data = [Buffer.from("transactionData1", 'utf-8').toString('base64'), Buffer.from("transactionData2", 'utf-8').toString('base64')];
    tx.output = {
        output: 'transactionOutput',
        fee: Buffer.from("feeAmount", 'utf-8').toString('base64'),
        ctx: Buffer.from("contextData", 'utf-8').toString('base64'),
        get: [["getKey1", "getValue1"] , ["getKey2", "getValue2"]],
        set: [["setKey1", "setValue1"] , ["setKey2", "setValue2"]],
        events: [{
            contract: "contractAddress1",
            name: "eventName1",
            entries: ["entry1", "entry2"]
        }],
    }
    tx.created = 1620000000;

    const hash = tx.toHash();

    const extectedHash = ChainXSHelper.HexStringToBase64String("d972dd8061a370f09d20b2f1e644e8e6046e9c36b52229afe656fd2fc52f25af")

    await expect(hash).toBe(extectedHash);
});

test('Test sign', async () => {
    const w1 = new Wallet();
    const w2 = new Wallet();

    const tx = new Tx();
    tx.version = '1.0';
    tx.chain = "mainnet";
    tx.validator = [w2.address];
    tx.from = [w1.address];
    tx.debit = [ChainXSHelper.bigintToBase64String(BigInt(100))];
    tx.to = [w2.address];
    tx.amount = [""];
    tx.type = 1;
    tx.data = [""];
    tx.output = {
        output: '',
        fee: "",
        ctx: "",
        get: [],
        set: [],
        events: [],
    }
    tx.created = 1620000000;
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    tx.validatorSign = [await w2.signHash(tx.hash)];

    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.sign = tx.validatorSign;
    await expect(() => {
        tx.isValid();
    }).toThrow('invalid signature');
});