import { Slice } from '../types';
import { ChainXSHelper, Wallet } from '../utils';

const INVALID_ADDRESS = "ob2CuupRZfa1aCgvwLsbRzNpuQJuZxvnj"


test('Test hash', async () => {
    const slice = new Slice();
    slice.version = '1.0';
    slice.chain = 'mainnet';
    slice.height = 100;
    slice.blockHeight = 50;
    slice.transactionsCount = 20;
    slice.end = false
    slice.created = 1620000000;
    slice.from = "minerAddress";
    slice.lastHash = Buffer.from("lastHash", 'utf-8').toString('base64');
    slice.transactions = [Buffer.from("tx1", 'utf-8').toString('base64'), Buffer.from("tx2", 'utf-8').toString('base64')];
    const hash = slice.toHash();

    const extectedHash = ChainXSHelper.HexStringToBase64String("10746f345bd9424b64bbf794b92ab82e087d4f062bae686f10b505299f08209c");
    await expect(hash).toBe(extectedHash);
});

test('Test version - v2', async () => {
    const w1 = new Wallet();

    const slice = new Slice();
    slice.version = '3';
    slice.height = 10;
    slice.blockHeight = 10;
    slice.chain = 'testnet';
    slice.transactions = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    slice.transactionsCount = 1;
    slice.lastHash = 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65';
    slice.from = w1.address;
    slice.created = Math.floor(Date.now() / 1000);
    slice.end = false;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);

    await expect(() => {
        slice.isValid();
    }).not.toThrow();

    slice.version = '1';
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).toThrow("invalid version");

    slice.version = '3';
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).not.toThrow();

    slice.version = '-1';
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).toThrow();
});

test('Test height - v2', async () => {
    const MESSAGE_ERROR = 'invalid slice height';
    const w1 = new Wallet();

    const slice = new Slice();
    slice.version = '3';
    slice.height = 10;
    slice.blockHeight = 10;
    slice.chain = 'testnet';
    slice.transactions = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    slice.transactionsCount = 1;
    slice.lastHash = 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65';
    slice.from = w1.address;
    slice.created = Math.floor(Date.now() / 1000);
    slice.end = false;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);

    await expect(() => {
        slice.isValid();
    }).not.toThrow();

    slice.height = 0;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).not.toThrow();

    slice.height = -100;
    await expect(() => {
        slice.isValid();
    }).toThrow(MESSAGE_ERROR);

    slice.height = 1000.3434;
    await expect(() => {
        slice.isValid();
    }).toThrow(MESSAGE_ERROR);

    slice.height = 1000000000000;
    await expect(() => {
        slice.isValid();
    }).toThrow(MESSAGE_ERROR);
});

test('Test blockHeight - v2', async () => {
    const MESSAGE_ERROR = 'invalid slice blockHeight';
    const w1 = new Wallet();

    const slice = new Slice();
    slice.version = '3';
    slice.height = 10;
    slice.blockHeight = 10;
    slice.chain = 'testnet';
    slice.transactions = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    slice.transactionsCount = 1;
    slice.lastHash = 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65';
    slice.from = w1.address;
    slice.created = Math.floor(Date.now() / 1000);
    slice.end = false;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);

    await expect(() => {
        slice.isValid();
    }).not.toThrow();

    slice.blockHeight = 0;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).not.toThrow();

    slice.blockHeight = 1000.3434;
    await expect(() => {
        slice.isValid();
    }).toThrow(MESSAGE_ERROR);

    slice.blockHeight = -100;
    await expect(() => {
        slice.isValid();
    }).toThrow(MESSAGE_ERROR);

    slice.blockHeight = 1000000000000;
    await expect(() => {
        slice.isValid();
    }).toThrow(MESSAGE_ERROR);
});

test('Test transactionsCount - v2', async () => {
    const MESSAGE_ERROR = 'invalid slice transactionsCount';
    const w1 = new Wallet();

    const slice = new Slice();
    slice.version = '3';
    slice.height = 10;
    slice.blockHeight = 10;
    slice.chain = 'testnet';
    slice.transactions = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    slice.transactionsCount = 1;
    slice.lastHash = 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65';
    slice.from = w1.address;
    slice.created = Math.floor(Date.now() / 1000);
    slice.end = false;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);

    await expect(() => {
        slice.isValid();
    }).not.toThrow();

    slice.transactionsCount = 0;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).toThrow();

    slice.transactionsCount = 1000.3434;
    await expect(() => {
        slice.isValid();
    }).toThrow(MESSAGE_ERROR);

    slice.transactionsCount = -100;
    await expect(() => {
        slice.isValid();
    }).toThrow(MESSAGE_ERROR);

    slice.transactionsCount = 1000000000000;
    await expect(() => {
        slice.isValid();
    }).toThrow(MESSAGE_ERROR);
});

test('Test chain - v2', async () => {
    const w1 = new Wallet();

    const slice = new Slice();
    slice.version = '3';
    slice.height = 10;
    slice.blockHeight = 10;
    slice.chain = 'testnet';
    slice.transactions = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    slice.transactionsCount = 1;
    slice.lastHash = 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65';
    slice.from = w1.address;
    slice.created = Math.floor(Date.now() / 1000);
    slice.end = false;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);

    await expect(() => {
        slice.isValid();
    }).not.toThrow();

    slice.chain = 'banana';
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).not.toThrow();

    slice.chain = 'bana_234';
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).not.toThrow();

    slice.chain = '';
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).toThrow();

    slice.chain = 'asdf-asdf';
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).toThrow();
});

test('Test transactions - v2', async () => {
    const w1 = new Wallet();

    const slice = new Slice();
    slice.version = '3';
    slice.height = 10;
    slice.blockHeight = 10;
    slice.chain = 'testnet';
    slice.transactionsCount = 1;
    slice.transactions = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    slice.lastHash = 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65';
    slice.from = w1.address;
    slice.created = Math.floor(Date.now() / 1000);
    slice.end = false;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).not.toThrow();

    slice.transactions = [];
    slice.transactionsCount = 0;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).toThrow();
    
    slice.transactions = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    slice.transactionsCount = 1;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).not.toThrow();

    slice.transactions = [];
    slice.transactionsCount = 1;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).toThrow();
    
    slice.transactions = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    slice.transactionsCount = 0;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).toThrow();
    
    slice.transactions = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    slice.transactionsCount = 2;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).toThrow();
    
    slice.transactions = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65', 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    slice.transactionsCount = 1;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).toThrow();
    
    slice.transactions = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65', 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    slice.transactionsCount = 2;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).not.toThrow();
});

test('Test from - v2', async () => {
    const w1 = new Wallet();

    const slice = new Slice();
    slice.version = '3';
    slice.height = 10;
    slice.blockHeight = 10;
    slice.chain = 'testnet';
    slice.transactions = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    slice.transactionsCount = 1;
    slice.lastHash = 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65';
    slice.from = w1.address;
    slice.created = Math.floor(Date.now() / 1000);
    slice.end = false;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);

    await expect(() => {
        slice.isValid();
    }).not.toThrow();

    slice.from = '';
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).toThrow();

    slice.from = 'banana';
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).toThrow();
    
    slice.from = INVALID_ADDRESS;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).toThrow();
});

test('Test created - v2', async () => {
    const MESSAGE_ERROR = 'invalid created date';
    const w1 = new Wallet();

    const slice = new Slice();
    slice.version = '3';
    slice.height = 10;
    slice.blockHeight = 10;
    slice.chain = 'testnet';
    slice.transactions = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    slice.transactionsCount = 1;
    slice.lastHash = 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65';
    slice.from = w1.address;
    slice.created = Math.floor(Date.now() / 1000);
    slice.end = false;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).not.toThrow();

    slice.created = 0;
    await expect(() => {
        slice.isValid();
    }).toThrow('');

    slice.created = -100;
    await expect(() => {
        slice.isValid();
    }).toThrow(MESSAGE_ERROR);

    slice.created = 1000.3434;
    await expect(() => {
        slice.isValid();
    }).toThrow(MESSAGE_ERROR);

    slice.created = 1000000000000;
    await expect(() => {
        slice.isValid();
    }).toThrow(MESSAGE_ERROR);
});

test('Test end - v2', async () => {
    const w1 = new Wallet();

    const slice = new Slice();
    slice.version = '3';
    slice.height = 10;
    slice.blockHeight = 10;
    slice.chain = 'testnet';
    slice.transactions = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    slice.transactionsCount = 1;
    slice.lastHash = 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65';
    slice.from = w1.address;
    slice.created = Math.floor(Date.now() / 1000);
    slice.end = false;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).not.toThrow();

    slice.end = true;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).not.toThrow();

    slice.end = "123" as any;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).toThrow();
});

test('Test hash - v2', async () => {
    const MESSAGE_ERROR = 'corrupt transaction';

    const w1 = new Wallet();
    const w2 = new Wallet();

    const slice = new Slice();
    slice.version = '3';
    slice.height = 10;
    slice.blockHeight = 10;
    slice.transactionsCount = 1;
    slice.chain = 'testnet';
    slice.transactions = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    slice.lastHash = 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65';
    slice.from = w1.address;
    slice.created = Math.floor(Date.now() / 1000);
    slice.end = false;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).not.toThrow();
    
    await expect(() => {
        const editedSlice = new Slice(slice);
        editedSlice.height = 15;
        editedSlice.isValid();
    }).toThrow(MESSAGE_ERROR);
    
    await expect(() => {
        const editedSlice = new Slice(slice);
        editedSlice.blockHeight = 15;
        editedSlice.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedSlice = new Slice(slice);
        editedSlice.transactions = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65', 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
        editedSlice.transactionsCount = 2;
        editedSlice.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedSlice = new Slice(slice);
        editedSlice.chain = 'asddsad';
        editedSlice.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedSlice = new Slice(slice);
        editedSlice.transactions = ['471e3ddcb5aad7b720acd4373262475f224117f1a9113d072ed728432cbf4f65'];
        editedSlice.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedSlice = new Slice(slice);
        editedSlice.lastHash = '471e3ddcb5aad7b7207acd4373262475f224117f1a9113d02ed728432cbf4f65';
        editedSlice.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedSlice = new Slice(slice);
        editedSlice.from = w2.address;
        editedSlice.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedSlice = new Slice(slice);
        editedSlice.created = slice.created + 1;
        editedSlice.isValid();
    }).toThrow(MESSAGE_ERROR);
    
    await expect(() => {
        const editedSlice = new Slice(slice);
        editedSlice.end = true;
        editedSlice.isValid();
    }).toThrow(MESSAGE_ERROR);
});

test('Test sign - v2', async () => {
    const MESSAGE_ERROR = 'invalid slice signature';

    const w1 = new Wallet();
    const w2 = new Wallet();

    const slice = new Slice();
    slice.version = '3';
    slice.height = 10;
    slice.blockHeight = 10;
    slice.transactionsCount = 1;
    slice.chain = 'testnet';
    slice.transactions = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    slice.lastHash = 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65';
    slice.from = w1.address;
    slice.created = Math.floor(Date.now() / 1000);
    slice.end = false;
    slice.hash = slice.toHash();
    slice.sign = await w1.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).not.toThrow();

    slice.sign = await w2.signHash(slice.hash);
    await expect(() => {
        slice.isValid();
    }).toThrow(MESSAGE_ERROR);
    
    slice.sign = 'asdfasdfasdasdf';
    await expect(() => {
        slice.isValid();
    }).toThrow(MESSAGE_ERROR);
    
    slice.sign = '';
    await expect(() => {
        slice.isValid();
    }).toThrow(MESSAGE_ERROR);
});
