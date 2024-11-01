import { Tx, TxType } from '../types';
import { Wallet } from '../utils';

const INVALID_ADDRESS = "ob2CUupRZfa1aCgvwLsbRzNpuQJUZxvnj"

test('Test transaction - v3', async () => {
    const wallet = new Wallet();
    const walletValidator = new Wallet();

    let tx = new Tx();
    tx.version = '3';
    tx.chain = "testnet";
    tx.from = [wallet.address];
    tx.to = [wallet.address];
    tx.amount = ['0'];
    tx.fee = '0';
    tx.type = TxType.TX_EN_CONTRACT_EXE;
    tx.data = [{ method: 'transfer', inputs: [wallet.address, `100`] }];
    tx.foreignKeys = ["acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65"];
    tx.created = Math.floor(Date.now() / 1000);
    tx.output = {
        feeUsed: '0',
        cost: 0,
        size: 2,
        ctx: "0000000000000000000000000000000000000000000000000000000000000000",
        debit: '0',
        logs: [],
        events: [],
        get: [],
        walletAddress: [],
        walletAmount: [],
        envs: { keys: [], values: [] },
        output: ''
    }
    tx.validator = [walletValidator.address];
    tx.hash = tx.toHash();
    tx.sign = [await wallet.signHash(tx.hash)];
    tx.validatorSign = [await walletValidator.signHash(tx.hash)];

    await expect(() => {
        tx.isValid();
    }).not.toThrow();
});

test('Test version - v3', async () => {
    const w1 = new Wallet();

    const tx = new Tx();
    tx.version = '3';
    tx.chain = "testnet";
    tx.from = [w1.address];
    tx.to = [w1.address];
    tx.amount = ['30'];
    tx.fee = '2';
    tx.type = TxType.TX_EN_CONTRACT_EXE;
    tx.data = [{ method: 'transfer', inputs: [w1.address, `100`] }];
    tx.foreignKeys = ["acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65"];
    tx.created = Math.floor(Date.now() / 1000);
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.version = '1';
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();

    tx.version = '3';
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.version = '-1';
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();
});

test('Test chain - v3', async () => {
    const w1 = new Wallet();

    const tx = new Tx();
    tx.version = '3';
    tx.chain = "testnet";
    tx.from = [w1.address];
    tx.to = [w1.address];
    tx.amount = ['30'];
    tx.fee = '2';
    tx.type = TxType.TX_EN_CONTRACT_EXE;
    tx.data = [{ method: 'transfer', inputs: [w1.address, `100`] }];
    tx.foreignKeys = ["acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65"];
    tx.created = Math.floor(Date.now() / 1000);
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.chain = 'banana';
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.chain = 'bana_234';
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.chain = '';
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();

    tx.chain = 'asdf-asdf';
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();
});

test('Test from - v2', async () => {
    const w1 = new Wallet();

    const tx = new Tx();
    tx.version = '3';
    tx.chain = "testnet";
    tx.from = [w1.address];
    tx.to = [w1.address];
    tx.amount = ['30'];
    tx.fee = '2';
    tx.type = TxType.TX_EN_CONTRACT_EXE;
    tx.data = [{ method: 'transfer', inputs: [w1.address, `100`] }];
    tx.foreignKeys = ["acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65"];
    tx.created = Math.floor(Date.now() / 1000);
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.from = [];
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();

    tx.from = new Array(200).fill(w1.address);
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();


    tx.from = [INVALID_ADDRESS];
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();
});

test('Test to - v2', async () => {
    const w1 = new Wallet();

    const tx = new Tx();
    tx.version = '3';
    tx.chain = "testnet";
    tx.from = [w1.address];
    tx.to = [w1.address];
    tx.amount = ['30'];
    tx.fee = '2';
    tx.type = TxType.TX_EN_CONTRACT_EXE;
    tx.data = [{ method: 'transfer', inputs: [w1.address, `100`] }];
    tx.foreignKeys = ["acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65"];
    tx.created = Math.floor(Date.now() / 1000);
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.to = [];
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();

    tx.to = new Array(200).fill(w1.address);
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();


    tx.to = [INVALID_ADDRESS];
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();
});

test('Test amount - v2', async () => {
    const w1 = new Wallet();

    const tx = new Tx();
    tx.version = '3';
    tx.chain = "testnet";
    tx.from = [w1.address];
    tx.to = [w1.address];
    tx.amount = ['30'];
    tx.fee = '2';
    tx.type = TxType.TX_EN_CONTRACT_EXE;
    tx.data = [{ method: 'transfer', inputs: [w1.address, `100`] }];
    tx.foreignKeys = ["acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65"];
    tx.created = Math.floor(Date.now() / 1000);
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.amount = [];
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();

    tx.amount = [''];
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();

    tx.amount = new Array(200).fill('10');
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();


    tx.amount = ['erff'];
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();

    tx.amount = ['-292'];
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();

    tx.amount = ['10000000000000000000000000000000000000000000000000'];
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();

    tx.amount = ['10.000002'];
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();

    tx.to = [w1.address, w1.address];
    tx.amount = ['100', '100'];
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.to = [w1.address];
    tx.amount = ['100', '100'];
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();

    tx.to = [w1.address, w1.address];
    tx.amount = ['100'];
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();
});

test('Test fee - v2', async () => {
    const w1 = new Wallet();

    const tx = new Tx();
    tx.version = '3';
    tx.chain = "testnet";
    tx.from = [w1.address];
    tx.to = [w1.address];
    tx.amount = ['30'];
    tx.fee = '2';
    tx.type = TxType.TX_EN_CONTRACT_EXE;
    tx.data = [{ method: 'transfer', inputs: [w1.address, `100`] }];
    tx.foreignKeys = ["acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65"];
    tx.created = Math.floor(Date.now() / 1000);
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.fee = '2.0334';
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();

    tx.fee = '20334';
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.fee = '';
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();

    tx.fee = '-292';
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();

    tx.fee = '100000000000000000000000000000000000000000000000000000000000000000';
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();

    tx.fee = '0.0000000000000000000000000000000000000001';
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();
});

test('Test type - v2', async () => {
    const w1 = new Wallet();

    const tx = new Tx();
    tx.version = '3';
    tx.chain = "testnet";
    tx.from = [w1.address];
    tx.to = [w1.address];
    tx.amount = ['30'];
    tx.fee = '2';
    tx.type = TxType.TX_EN_CONTRACT_EXE;
    tx.data = [{ method: 'transfer', inputs: [w1.address, `100`] }];
    tx.foreignKeys = ["acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65"];
    tx.created = Math.floor(Date.now() / 1000);
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.type = 'anyvalue';
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();

    tx.type = '';
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();
});

test('Test data - v2', async () => {
    const w1 = new Wallet();

    const tx = new Tx();
    tx.version = '3';
    tx.chain = "testnet";
    tx.from = [w1.address];
    tx.to = [w1.address];
    tx.amount = ['30'];
    tx.fee = '2';
    tx.type = TxType.TX_EN_CONTRACT_EXE;
    tx.data = [{ method: 'transfer', inputs: [w1.address, `100`] }];
    tx.foreignKeys = ["acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65"];
    tx.created = Math.floor(Date.now() / 1000);
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.data = 'anyvalue';
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.data = 213.323;
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.data = true;
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.data = null;
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.data = undefined;
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.data = {};
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.data = {
        method: 'banana',
        amount: '100',
    };
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    // changing order of parameters should result in the same hash
    tx.data = {
        amount: '100',
        method: 'banana',
    };
    await expect(tx.toHash()).toBe(tx.hash);

    // changing parameters should result in the other hash
    tx.data = {
        amount: '101',
        method: 'banana',
    };
    await expect(tx.toHash()).not.toBe(tx.hash);

    tx.data = [];
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.data = [
        { method: 'transfer1', inputs: [w1.address, `100`] },
        { method: 'transfer2', inputs: [w1.address, `100`] },
    ];
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    // changing order of list should result in the other hash
    tx.data = [
        { method: 'transfer2', inputs: [w1.address, `100`] },
        { method: 'transfer1', inputs: [w1.address, `100`] },
    ];
    await expect(tx.toHash()).not.toBe(tx.hash);
});

test('Test foreignKeys - v2', async () => {
    const w1 = new Wallet();

    const tx = new Tx();
    tx.version = '3';
    tx.chain = "testnet";
    tx.from = [w1.address];
    tx.to = [w1.address];
    tx.amount = ['30'];
    tx.fee = '2';
    tx.type = TxType.TX_EN_CONTRACT_EXE;
    tx.data = [{ method: 'transfer', inputs: [w1.address, `100`] }];
    tx.foreignKeys = ["acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65"];
    tx.created = Math.floor(Date.now() / 1000);
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.foreignKeys = [];
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.foreignKeys = undefined;
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();

    tx.foreignKeys = new Array(200).fill(w1.address);
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();

    tx.foreignKeys = ["asdfasdfasdfasdfsd"];
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.foreignKeys = ["asdfasdfasdfasdfsdasdfasdfasdfasdfsdasdfasdfasdfasdfsdasdfasdfasdfasdfsd"];
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow();
});

test('Test created - v2', async () => {
    const MESSAGE_ERROR = 'invalid created date';
    const w1 = new Wallet();

    const tx = new Tx();
    tx.version = '3';
    tx.chain = "testnet";
    tx.from = [w1.address];
    tx.to = [w1.address];
    tx.amount = ['30'];
    tx.fee = '2';
    tx.type = TxType.TX_EN_CONTRACT_EXE;
    tx.data = [{ method: 'transfer', inputs: [w1.address, `100`] }];
    tx.foreignKeys = ["acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65"];
    tx.created = Math.floor(Date.now() / 1000);
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.created = 0;
    await expect(() => {
        tx.isValid();
    }).toThrow('');

    tx.created = -100;
    await expect(() => {
        tx.isValid();
    }).toThrow(MESSAGE_ERROR);

    tx.created = 1000.3434;
    await expect(() => {
        tx.isValid();
    }).toThrow(MESSAGE_ERROR);

    tx.created = 1000000000000;
    await expect(() => {
        tx.isValid();
    }).toThrow(MESSAGE_ERROR);
});

test('Test hash - v2', async () => {
    const MESSAGE_ERROR = 'corrupt transaction';
    const w1 = new Wallet();
    const w2 = new Wallet();

    let tx = new Tx();
    tx.version = '3';
    tx.chain = "testnet";
    tx.from = [w1.address];
    tx.to = [w1.address];
    tx.amount = ['0'];
    tx.fee = '0';
    tx.type = TxType.TX_EN_CONTRACT_EXE;
    tx.data = [{ method: 'transfer', inputs: [w1.address, `100`] }];
    tx.foreignKeys = ["acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65"];
    tx.created = Math.floor(Date.now() / 1000);
    tx.validator = [w2.address];
    tx.output = {
        feeUsed: '0',
        cost: 0,
        size: 2,
        ctx: "0000000000000000000000000000000000000000000000000000000000000000",
        debit: '0',
        logs: [
            'text_log'
        ],
        events: [
            {
                contractAddress: 'ob2CUupRZfa1aCgvwLsbRzNpuQJuZxvnj',
                eventName: 'transfer',
                entries: [
                    'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'
                ],
            }
        ],
        get: [
            'ob2CUupRZfa1aCgvwLsbRzNpuQJuZxvnj-WC'
        ],
        walletAddress: [
            'ob2CUupRZfa1aCgvwLsbRzNpuQJuZxvnj'
        ],
        walletAmount: [
            '100'
        ],
        envs: {
            keys: [
                `ob2CUupRZfa1aCgvwLsbRzNpuQJuZxvnj-MC`,
            ], values: [
                '"1000"'
            ]
        },
        output: 'true'
    }
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    tx.validatorSign = [await w2.signHash(tx.hash)];

    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.isValid();
    }).not.toThrow();

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.chain = 'edit';
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.from = [w2.address];
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.to = [w2.address];
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.amount = ['31'];
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.fee = '3';
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.type = TxType.TX_COMMAND;
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.data = [{ method: 'transfer', inputs: [w2.address, `30`] }];
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.foreignKeys = ["dcb5aad7b72072edacd4373262475f224117f1a9113d0471e3d728432cbf4f65"];
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.created = tx.created + 1;
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const w3 = new Wallet();
        const editedTX = new Tx(tx);
        editedTX.validator = [w3.address];
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.output.cost = 123;
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.output.ctx = 'dcb5aad7b72072edacd4373262475f224117f1a9113d0471e3d728432cbf4f65';
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.output.debit = '31';
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.output.envs.keys[0] = 'asdf';
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.output.envs.values[0] = 'asdf';
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.output.events[0].contractAddress = 'ob2CUupRZfa1aCgvwLsbRzNpuQJuZxvnj';
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.output.events[0].entries[0] = '9113d0471e3ddcacd4373262475f224117f1ab5aad7b72072ed728432cbf4f65';
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.output.events[0].eventName = 'asdf';
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.output.feeUsed = '31';
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.output.get[0] = 'asdf';
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.output.logs = ['31'];
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.output.output = '31';
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.output.size = 123;
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.output.walletAddress = ['ob2CUupRZfa1aCgvwLsbRzNpuQJuZxvnj'];
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedTX = new Tx(tx);
        editedTX.output.walletAmount = ['31'];
        editedTX.isValid();
    }).toThrow(MESSAGE_ERROR);
});

test('Test sign - v2', async () => {
    const MESSAGE_ERROR = 'invalid signature';
    const w1 = new Wallet();
    const w2 = new Wallet();

    const tx = new Tx();
    tx.version = '3';
    tx.chain = "testnet";
    tx.from = [w1.address];
    tx.to = [w2.address];
    tx.amount = ['30'];
    tx.fee = '2';
    tx.type = TxType.TX_EN_CONTRACT_EXE;
    tx.data = [{ method: 'transfer', inputs: [w2.address, `100`] }];
    tx.foreignKeys = ["acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65"];
    tx.created = Math.floor(Date.now() / 1000);
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.sign = [];
    await expect(() => {
        tx.isValid();
    }).toThrow('transaction was not signed');

    tx.from = [w1.address, w1.address];
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash), await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).not.toThrow();

    tx.from = [w1.address];
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash), await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow(MESSAGE_ERROR);

    tx.from = [w1.address, w1.address];
    tx.hash = tx.toHash();
    tx.sign = [await w1.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow(MESSAGE_ERROR);

    tx.from = [w1.address];
    tx.hash = tx.toHash();
    tx.sign = ["0x0bb201b93a6f53e073e7392f368f86496be99ce9031d8697086fe6d70cf365971906fcce8a20071e0d5e6968ef5a672225a7c552a562100f43aa175ec9ae61581c"];
    await expect(() => {
        tx.isValid();
    }).toThrow(MESSAGE_ERROR);

    tx.from = [w1.address];
    tx.hash = tx.toHash();
    tx.sign = [await w2.signHash(tx.hash)];
    await expect(() => {
        tx.isValid();
    }).toThrow(MESSAGE_ERROR);
});
