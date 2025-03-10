import { Block } from '../types';
import { ChainXSHelper, Wallet } from '../utils';

const INVALID_ADDRESS = "ob2CuupRZfa1aCgvwLsbRzNpuQJuZxvnj"

test('Test hash', async () => {
    const block = new Block();
    block.version = '1.0';
    block.chain = 'main';
    block.height = 12345;
    block.transactionsCount = 50;
    block.from = "minerAddress";
    block.created = 1620000000;
    block.slices = [Buffer.from("slice1", 'utf-8').toString('base64'), Buffer.from("slice2", 'utf-8').toString('base64')];
    block.lastHash = Buffer.from("previousHash", 'utf-8').toString('base64');
    const hash = block.toHash();

    const extectedHash = ChainXSHelper.HexStringToBase64String("93a6c8c5e2df2acc41e492993f706d99c40c3afe2edf600821b7b575ce389566")

    await expect(hash).toBe(extectedHash);
});

test('Test version - v2', async () => {
    const w1 = new Wallet();

    const block = new Block();
    block.height = 10;
    block.slices = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    block.transactionsCount = 1;
    block.version = '2';
    block.chain = 'testnet';
    block.from = w1.address;
    block.created = Math.floor(Date.now() / 1000);
    block.lastHash = 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65';
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);

    await expect(() => {
        block.isValid();
    }).not.toThrow();

    block.version = '1';
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).toThrow();

    block.version = '2';
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).not.toThrow();

    block.version = '3';
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).toThrow();

    block.version = '-1';
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).toThrow();
});

test('Test height - v2', async () => {
    const MESSAGE_ERROR = 'invalid block height';
    const w1 = new Wallet();

    const block = new Block();
    block.version = '2';
    block.height = 10;
    block.chain = 'testnet';
    block.slices = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    block.transactionsCount = 1;
    block.from = w1.address;
    block.created = Math.floor(Date.now() / 1000);
    block.lastHash = 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65';
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);

    await expect(() => {
        block.isValid();
    }).not.toThrow();

    block.height = 0;
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).not.toThrow();

    block.height = -100;
    await expect(() => {
        block.isValid();
    }).toThrow(MESSAGE_ERROR);

    block.height = 1000.3434;
    await expect(() => {
        block.isValid();
    }).toThrow(MESSAGE_ERROR);

    block.height = 1000000000000;
    await expect(() => {
        block.isValid();
    }).toThrow(MESSAGE_ERROR);
});

test('Test transactionsCount - v2', async () => {
    const MESSAGE_ERROR = 'invalid block transactionsCount';
    const w1 = new Wallet();

    const block = new Block();
    block.version = '2';
    block.height = 10;
    block.chain = 'testnet';
    block.slices = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    block.transactionsCount = 1;
    block.from = w1.address;
    block.created = Math.floor(Date.now() / 1000);
    block.lastHash = 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65';
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).not.toThrow();

    block.transactionsCount = 5;
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).not.toThrow();

    block.transactionsCount = 1000.3434;
    await expect(() => {
        block.isValid();
    }).toThrow(MESSAGE_ERROR);

    block.transactionsCount = -100;
    await expect(() => {
        block.isValid();
    }).toThrow(MESSAGE_ERROR);

    block.transactionsCount = 1000000000000;
    await expect(() => {
        block.isValid();
    }).toThrow(MESSAGE_ERROR);
});

test('Test chain - v2', async () => {
    const w1 = new Wallet();

    const block = new Block();
    block.version = '2';
    block.height = 10;
    block.chain = 'testnet';
    block.slices = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    block.transactionsCount = 1;
    block.from = w1.address;
    block.created = Math.floor(Date.now() / 1000);
    block.lastHash = 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65';
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);

    await expect(() => {
        block.isValid();
    }).not.toThrow();

    block.chain = 'banana';
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).not.toThrow();

    block.chain = 'bana_234';
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).not.toThrow();

    block.chain = '';
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).toThrow();

    block.chain = 'asdf-asdf';
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).toThrow();
});

test('Test slices - v2', async () => {
    const w1 = new Wallet();

    const block = new Block();
    block.version = '2';
    block.height = 10;
    block.chain = 'testnet';
    block.transactionsCount = 1;
    block.slices = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    block.from = w1.address;
    block.created = Math.floor(Date.now() / 1000);
    block.lastHash = 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65';
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).not.toThrow();

    block.slices = [];
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).not.toThrow();
    
    block.slices = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).not.toThrow();
    
    block.slices = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65', 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).not.toThrow();

    block.slices = ['aaaaaa'];
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).toThrow();
});

test('Test from - v2', async () => {
    const w1 = new Wallet();

    const block = new Block();
    block.version = '2';
    block.height = 10;
    block.chain = 'testnet';
    block.slices = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    block.transactionsCount = 1;
    block.from = w1.address;
    block.created = Math.floor(Date.now() / 1000);
    block.lastHash = 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65';
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);

    await expect(() => {
        block.isValid();
    }).not.toThrow();

    block.from = '';
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).toThrow();

    block.from = 'banana';
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).toThrow();
    
    block.from = INVALID_ADDRESS;
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).toThrow();
});

test('Test created - v2', async () => {
    const MESSAGE_ERROR = 'invalid created date';
    const w1 = new Wallet();

    const block = new Block();
    block.version = '2';
    block.height = 10;
    block.chain = 'testnet';
    block.slices = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    block.transactionsCount = 1;
    block.from = w1.address;
    block.created = Math.floor(Date.now() / 1000);
    block.lastHash = 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65';
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).not.toThrow();

    block.created = 0;
    await expect(() => {
        block.isValid();
    }).toThrow('');

    block.created = -100;
    await expect(() => {
        block.isValid();
    }).toThrow(MESSAGE_ERROR);

    block.created = 1000.3434;
    await expect(() => {
        block.isValid();
    }).toThrow(MESSAGE_ERROR);

    block.created = 1000000000000;
    await expect(() => {
        block.isValid();
    }).toThrow(MESSAGE_ERROR);
});

test('Test hash - v2', async () => {
    const MESSAGE_ERROR = 'corrupt transaction';

    const w1 = new Wallet();
    const w2 = new Wallet();

    const block = new Block();
    block.version = '2';
    block.height = 10;
    block.transactionsCount = 1;
    block.chain = 'testnet';
    block.slices = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    block.from = w1.address;
    block.created = Math.floor(Date.now() / 1000);
    block.lastHash = 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65';
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).not.toThrow();
    
    await expect(() => {
        const editedBlock = new Block(block);
        editedBlock.height = 15;
        editedBlock.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedBlock = new Block(block);
        editedBlock.slices = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65', 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
        editedBlock.transactionsCount = 2;
        editedBlock.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedBlock = new Block(block);
        editedBlock.chain = 'asddsad';
        editedBlock.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedBlock = new Block(block);
        editedBlock.slices = ['471e3ddcb5aad7b720acd4373262475f224117f1a9113d072ed728432cbf4f65'];
        editedBlock.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedBlock = new Block(block);
        editedBlock.from = w2.address;
        editedBlock.isValid();
    }).toThrow(MESSAGE_ERROR);

    await expect(() => {
        const editedBlock = new Block(block);
        editedBlock.created = block.created + 1;
        editedBlock.isValid();
    }).toThrow(MESSAGE_ERROR);
    
    await expect(() => {
        const editedBlock = new Block(block);
        editedBlock.lastHash = '471e3ddcb5aad7b720acd4373262475f224117f1a9113d072ed728432cbf4f65';
        editedBlock.isValid();
    }).toThrow(MESSAGE_ERROR);
});

test('Test sign - v2', async () => {
    const MESSAGE_ERROR = 'invalid block signature';

    const w1 = new Wallet();
    const w2 = new Wallet();

    const block = new Block();
    block.version = '2';
    block.height = 10;
    block.transactionsCount = 1;
    block.chain = 'testnet';
    block.slices = ['acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65'];
    block.from = w1.address;
    block.created = Math.floor(Date.now() / 1000);
    block.lastHash = 'acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65';
    block.hash = block.toHash();
    block.sign = await w1.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).not.toThrow();

    block.sign = await w2.signHash(block.hash);
    await expect(() => {
        block.isValid();
    }).toThrow(MESSAGE_ERROR);
    
    block.sign = 'asdfasdfasdasdf';
    await expect(() => {
        block.isValid();
    }).toThrow(MESSAGE_ERROR);
    
    block.sign = '';
    await expect(() => {
        block.isValid();
    }).toThrow(MESSAGE_ERROR);
});
