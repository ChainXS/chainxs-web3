import { Wallet, ChainXSHelper, ChainXSAddressType } from '../utils';

test('encode decode address', async () => {
    const addresses = [
        "0xffffffffffffffffffffffffffffffffffffffff",
        "0x0000000000000000000000000000000000000001",
        "0x1000000000000000000000000000000000000000",
        "0x283a008f49b33637a1afd7b08eec30f1b17f5c95"
    ];

    for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i];

        let addressInfo = ChainXSHelper.decodeBWSAddress(ChainXSHelper.encodeBWSAddress(ChainXSAddressType.CONTRACT_ACCOUNT, address))
        await expect(addressInfo.ethAddress).toBe(address);
        await expect(addressInfo.typeAddress).toBe(ChainXSAddressType.CONTRACT_ACCOUNT);

        addressInfo = ChainXSHelper.decodeBWSAddress(ChainXSHelper.encodeBWSAddress(ChainXSAddressType.EXTERNALLY_OWNED_ACCOUNT, address))
        await expect(addressInfo.ethAddress).toBe(address);
        await expect(addressInfo.typeAddress).toBe(ChainXSAddressType.EXTERNALLY_OWNED_ACCOUNT);

        addressInfo = ChainXSHelper.decodeBWSAddress(ChainXSHelper.encodeBWSAddress(ChainXSAddressType.EXTERNALLY_OWNED_SMART_ACCOUNT, address))
        await expect(addressInfo.ethAddress).toBe(address);
        await expect(addressInfo.typeAddress).toBe(ChainXSAddressType.EXTERNALLY_OWNED_SMART_ACCOUNT);

        addressInfo = ChainXSHelper.decodeBWSAddress(ChainXSHelper.encodeBWSAddress(ChainXSAddressType.STEALTH_ADDRESS_ACCOUNT, address))
        await expect(addressInfo.ethAddress).toBe(address);
        await expect(addressInfo.typeAddress).toBe(ChainXSAddressType.STEALTH_ADDRESS_ACCOUNT);
    }
});

test('encode decode zero address', async () => {
    const address = "0x0000000000000000000000000000000000000000";

    let addressInfo = ChainXSHelper.decodeBWSAddress(ChainXSHelper.encodeBWSAddress(ChainXSAddressType.CONTRACT_ACCOUNT, address))
    await expect(addressInfo.ethAddress).toBe(address);
    await expect(addressInfo.bwsAddress).toBe(ChainXSHelper.ZERO_ADDRESS);
    await expect(addressInfo.typeAddress).toBe(ChainXSAddressType.ZERO_ACCOUNT);

    addressInfo = ChainXSHelper.decodeBWSAddress(ChainXSHelper.encodeBWSAddress(ChainXSAddressType.EXTERNALLY_OWNED_ACCOUNT, address))
    await expect(addressInfo.ethAddress).toBe(address);
    await expect(addressInfo.bwsAddress).toBe(ChainXSHelper.ZERO_ADDRESS);
    await expect(addressInfo.typeAddress).toBe(ChainXSAddressType.ZERO_ACCOUNT);

    addressInfo = ChainXSHelper.decodeBWSAddress(ChainXSHelper.encodeBWSAddress(ChainXSAddressType.EXTERNALLY_OWNED_SMART_ACCOUNT, address))
    await expect(addressInfo.ethAddress).toBe(address);
    await expect(addressInfo.bwsAddress).toBe(ChainXSHelper.ZERO_ADDRESS);
    await expect(addressInfo.typeAddress).toBe(ChainXSAddressType.ZERO_ACCOUNT);

    addressInfo = ChainXSHelper.decodeBWSAddress(ChainXSHelper.encodeBWSAddress(ChainXSAddressType.STEALTH_ADDRESS_ACCOUNT, address))
    await expect(addressInfo.ethAddress).toBe(address);
    await expect(addressInfo.bwsAddress).toBe(ChainXSHelper.ZERO_ADDRESS);
    await expect(addressInfo.typeAddress).toBe(ChainXSAddressType.ZERO_ACCOUNT);

    const nonZeroAddress = "0xffffffffffffffffffffffffffffffffffffffff";

    addressInfo = ChainXSHelper.decodeBWSAddress(ChainXSHelper.encodeBWSAddress(ChainXSAddressType.ZERO_ACCOUNT, nonZeroAddress))
    await expect(addressInfo.ethAddress).toBe(address);
    await expect(addressInfo.bwsAddress).toBe(ChainXSHelper.ZERO_ADDRESS);
    await expect(addressInfo.typeAddress).toBe(ChainXSAddressType.ZERO_ACCOUNT);
});

test('corrupted addresses', async () => {
    const addresses = [
        "0xffffffffffffffffffffffffffffffffffffffff",
        "0x0000000000000000000000000000000000000001",
        "0x1000000000000000000000000000000000000000",
        "0x281afd7b08eec33a008f49b33637a0f1b17f5c95"
    ];

    for (let i = 0; i < addresses.length; i++) {
        const ethAddress = addresses[i];

        const bwsAddress = ChainXSHelper.encodeBWSAddress(ChainXSAddressType.EXTERNALLY_OWNED_ACCOUNT, ethAddress);

        await expect(() => {
            ChainXSHelper.decodeBWSAddress(bwsAddress.toLowerCase());
        }).toThrow();

        await expect(() => {
            ChainXSHelper.decodeBWSAddress(bwsAddress.toUpperCase());
        }).toThrow();

        await expect(() => { // change init
            ChainXSHelper.decodeBWSAddress('sb' + bwsAddress.substring(2));
        }).toThrow();

        let addressInfo = ChainXSHelper.decodeBWSAddress('sb' + ChainXSHelper.encodeBWSAddress(ChainXSAddressType.STEALTH_ADDRESS_ACCOUNT, ethAddress).substring(2));
        await expect(addressInfo.ethAddress).toBe(ethAddress);

        await expect(() => { // change middle
            ChainXSHelper.decodeBWSAddress(bwsAddress.substring(0, 10) + 'b' + bwsAddress.substring(11));
        }).toThrow();

        await expect(() => { // change end
            ChainXSHelper.decodeBWSAddress(bwsAddress.substring(0, 32) + 'b');
        }).toThrow();
    }
});

test('is valid address', async () => {
    const addresses = [
        "0xffffffffffffffffffffffffffffffffffffffff",
        "0x0000000000000000000000000000000000000001",
        "0x1000000000000000000000000000000000000000",
        "0x281afd7b08eec33a008f49b33637a0f1b17f5c95"
    ];

    for (let i = 0; i < addresses.length; i++) {
        const ethAddress = addresses[i];

        const bwsAddress = ChainXSHelper.encodeBWSAddress(ChainXSAddressType.EXTERNALLY_OWNED_ACCOUNT, ethAddress);

        let isValid = ChainXSHelper.isValidAddress(bwsAddress);
        await expect(isValid).toBe(true);

        isValid = ChainXSHelper.isValidAddress(bwsAddress.toLowerCase());
        await expect(isValid).toBe(false);

        isValid = ChainXSHelper.isValidAddress(bwsAddress.toUpperCase());
        await expect(isValid).toBe(false);

        isValid = ChainXSHelper.isValidAddress('sb' + bwsAddress.substring(2));
        await expect(isValid).toBe(false);

        isValid = ChainXSHelper.isValidAddress(bwsAddress.substring(0, 10) + 'b' + bwsAddress.substring(11));
        await expect(isValid).toBe(false);

        isValid = ChainXSHelper.isValidAddress(bwsAddress.substring(0, 32) + 'b');
        await expect(isValid).toBe(false);
    }

    await expect(ChainXSHelper.isValidAddress(ChainXSHelper.ZERO_ADDRESS)).toBe(true);
    await expect(ChainXSHelper.isValidAddress("000000000000000000000000000000000")).toBe(true);
    await expect(ChainXSHelper.isValidAddress("0000000000000000000000000000000000")).toBe(false);
    await expect(ChainXSHelper.isValidAddress("00000000000000000000000000000000")).toBe(false);

    await expect(ChainXSHelper.isValidAddress("ob2CUupRZfa1aCgvwLsbRzNpuQJuZxvnj")).toBe(true);
    await expect(ChainXSHelper.isValidAddress("ob2CuupRZfa1aCgvwLsbRzNpuQJuZxvnj")).toBe(false);
    await expect(ChainXSHelper.isValidAddress("ob2CUupRZfa1aCgvwLsbRzNpQJuZxvnj")).toBe(false);
    await expect(ChainXSHelper.isValidAddress("ob2CUupRZfa1aCgvwLsbRzNpuQJuZxvn")).toBe(false);
    await expect(ChainXSHelper.isValidAddress("ob2CUupRZfa1aCgvwLsbRzNpuQJuZxvnjj")).toBe(false);
    await expect(ChainXSHelper.isValidAddress("ob2CUupRZfa1aaCgvwLsbRzNpuQJuZxvnj")).toBe(false);
    await expect(ChainXSHelper.isValidAddress("1ob2CUupRZfa1aCgvwLsbRzNpuQJuZxvnj")).toBe(false);
    await expect(ChainXSHelper.isValidAddress("sb2CUupRZfa1aCgvwLsbRzNpuQJuZxvnj")).toBe(false);
    await expect(ChainXSHelper.isValidAddress("ob3CUupRZfa1aCgvwLsbRzNpuQJuZxvnj")).toBe(false);

    await expect(ChainXSHelper.isValidAddress("@felipemarts")).toBe(true);
    await expect(ChainXSHelper.isValidAddress("@long_long_username123")).toBe(true);
    await expect(ChainXSHelper.isValidAddress("@long_long_long_long_long_username123")).toBe(false);
    await expect(ChainXSHelper.isValidAddress("@felipe marts")).toBe(false);
});

test('test random address', async () => {
    for (let i = 0; i < 100; i++) {
        const wallet = new Wallet();
        await expect(ChainXSHelper.isValidAddress(wallet.getAddress(ChainXSAddressType.EXTERNALLY_OWNED_ACCOUNT))).toBe(true);
        await expect(ChainXSHelper.isValidAddress(wallet.getAddress(ChainXSAddressType.STEALTH_ADDRESS_ACCOUNT))).toBe(true);
        await expect(ChainXSHelper.isValidAddress(wallet.getAddress(ChainXSAddressType.EXTERNALLY_OWNED_SMART_ACCOUNT))).toBe(true);
        await expect(ChainXSHelper.isValidAddress(wallet.getAddress(ChainXSAddressType.CONTRACT_ACCOUNT))).toBe(true);
        await expect(ChainXSHelper.isValidAddress(wallet.getAddress(ChainXSAddressType.ZERO_ACCOUNT))).toBe(true);
    }
});

test('test sign', async () => {
    const w1 = new Wallet();
    const w2 = new Wallet();
    const hash1 = ChainXSHelper.HexStringToBase64String('d48685fd5602e80229b01c691ee502530c8f4a62e10009d6f75cd1e0cb6ad13e');
    const hash2 = ChainXSHelper.HexStringToBase64String('0c8f4a62e10009d6f75cd1e0cb6ad13ed48685fd5602e80229b01c691ee50253');

    const sign1 = await w1.signHash(hash1);
    const sign2 = await w2.signHash(hash1);

    await expect(ChainXSHelper.isValidSign(sign1, w1.address, hash1)).toBe(true);
    await expect(ChainXSHelper.isValidSign(sign1, w1.address, hash2)).toBe(false);
    await expect(ChainXSHelper.isValidSign(sign1, w2.address, hash1)).toBe(false);
    await expect(ChainXSHelper.isValidSign(sign2, w1.address, hash1)).toBe(false);
});

test('test wallet', async () => {
    const wallet = new Wallet();

    await expect(wallet.address).toBe(wallet.getAddress(ChainXSAddressType.EXTERNALLY_OWNED_ACCOUNT));

    let addressInfo = ChainXSHelper.decodeBWSAddress(wallet.getStealthAddress(0, 0));
    await expect(addressInfo.typeAddress).toBe(ChainXSAddressType.STEALTH_ADDRESS_ACCOUNT);

    const hash1 = ChainXSHelper.HexStringToBase64String('d48685fd5602e80229b01c691ee502530c8f4a62e10009d6f75cd1e0cb6ad13e');
    const hash2 = ChainXSHelper.HexStringToBase64String('0c8f4a62e10009d6f75cd1e0cb6ad13ed48685fd5602e80229b01c691ee50253');
    const stealthAddress1 = wallet.getStealthAddress(0, 1);
    const stealthAddress2 = wallet.getStealthAddress(0, 2);
    const sign1 = await wallet.signStealthAddressHash(hash1, 0, 1);
    const sign2 = await wallet.signStealthAddressHash(hash2, 0, 2);

    await expect(ChainXSHelper.isValidSign(sign1, stealthAddress1, hash1)).toBe(true);
    await expect(ChainXSHelper.isValidSign(sign1, stealthAddress1, hash2)).toBe(false);
    await expect(ChainXSHelper.isValidSign(sign1, stealthAddress2, hash1)).toBe(false);
    await expect(ChainXSHelper.isValidSign(sign2, stealthAddress1, hash1)).toBe(false);
});

test('test extended public key', async () => {
    const wallet = new Wallet();

    const xPub = wallet.getExtendedPublicKey(0);
    const stealthAddress1 = wallet.getStealthAddress(0, 1);
    const stealthAddress2 = wallet.getStealthAddress(0, 2);
    const loadStealthAddress1 = ChainXSHelper.getStealthAddressFromExtendedPublicKey(xPub, 1);
    const loadStealthAddress2 = ChainXSHelper.getStealthAddressFromExtendedPublicKey(xPub, 2);

    await expect(stealthAddress1).not.toBe(stealthAddress2);
    await expect(stealthAddress1).toBe(loadStealthAddress1);
    await expect(stealthAddress2).toBe(loadStealthAddress2);

    const account1xPub = wallet.getExtendedPublicKey(1);
    const account1stealthAddress1 = wallet.getStealthAddress(1, 1);
    const account1stealthAddress2 = wallet.getStealthAddress(1, 2);
    const account1loadStealthAddress1 = ChainXSHelper.getStealthAddressFromExtendedPublicKey(account1xPub, 1);
    const account1loadStealthAddress2 = ChainXSHelper.getStealthAddressFromExtendedPublicKey(account1xPub, 2);

    await expect(account1stealthAddress1).not.toBe(account1stealthAddress2);
    await expect(account1stealthAddress1).not.toBe(stealthAddress1);
    await expect(account1stealthAddress1).not.toBe(stealthAddress2);
    await expect(account1stealthAddress1).toBe(account1loadStealthAddress1);
    await expect(account1stealthAddress2).toBe(account1loadStealthAddress2);
});

test('test wallet seed', async () => {
    const w1 = new Wallet();
    const w2 = new Wallet();
    const w3 = new Wallet(w1.seed);

    await expect(w1.address).not.toBe(w2.address);
    await expect(w1.address).toBe(w3.address);
});

test('address types CA', async () => {
    const wallet = new Wallet();

    await expect(ChainXSHelper.isContractAddress(ChainXSHelper.newContractAddress())).toBe(true);

    await expect(ChainXSHelper.isContractAddress(wallet.getAddress(ChainXSAddressType.CONTRACT_ACCOUNT))).toBe(true);
    await expect(ChainXSHelper.isContractAddress(wallet.getAddress(ChainXSAddressType.EXTERNALLY_OWNED_ACCOUNT))).toBe(false);
    await expect(ChainXSHelper.isContractAddress(wallet.getAddress(ChainXSAddressType.EXTERNALLY_OWNED_SMART_ACCOUNT))).toBe(false);
    await expect(ChainXSHelper.isContractAddress('@named_account')).toBe(false);
    await expect(ChainXSHelper.isContractAddress(wallet.getAddress(ChainXSAddressType.STEALTH_ADDRESS_ACCOUNT))).toBe(false);
    await expect(ChainXSHelper.isContractAddress(wallet.getAddress(ChainXSAddressType.ZERO_ACCOUNT))).toBe(false);
});

test('address types EOA', async () => {
    const wallet = new Wallet();

    await expect(ChainXSHelper.isExternalOwnedAccount(wallet.getAddress(ChainXSAddressType.CONTRACT_ACCOUNT))).toBe(false);
    await expect(ChainXSHelper.isExternalOwnedAccount(wallet.getAddress(ChainXSAddressType.EXTERNALLY_OWNED_ACCOUNT))).toBe(true);
    await expect(ChainXSHelper.isExternalOwnedAccount(wallet.getAddress(ChainXSAddressType.EXTERNALLY_OWNED_SMART_ACCOUNT))).toBe(false);
    await expect(ChainXSHelper.isExternalOwnedAccount('@named_account')).toBe(false);
    await expect(ChainXSHelper.isExternalOwnedAccount(wallet.getAddress(ChainXSAddressType.STEALTH_ADDRESS_ACCOUNT))).toBe(false);
    await expect(ChainXSHelper.isExternalOwnedAccount(wallet.getAddress(ChainXSAddressType.ZERO_ACCOUNT))).toBe(false);
});

test('address types ESA', async () => {
    const wallet = new Wallet();

    await expect(ChainXSHelper.isExternaSmartAccount(wallet.getAddress(ChainXSAddressType.CONTRACT_ACCOUNT))).toBe(false);
    await expect(ChainXSHelper.isExternaSmartAccount(wallet.getAddress(ChainXSAddressType.EXTERNALLY_OWNED_ACCOUNT))).toBe(false);
    await expect(ChainXSHelper.isExternaSmartAccount(wallet.getAddress(ChainXSAddressType.EXTERNALLY_OWNED_SMART_ACCOUNT))).toBe(true);
    await expect(ChainXSHelper.isExternaSmartAccount('@named_account')).toBe(false);
    await expect(ChainXSHelper.isExternaSmartAccount(wallet.getAddress(ChainXSAddressType.STEALTH_ADDRESS_ACCOUNT))).toBe(false);
    await expect(ChainXSHelper.isExternaSmartAccount(wallet.getAddress(ChainXSAddressType.ZERO_ACCOUNT))).toBe(false);
});

test('address types NA', async () => {
    const wallet = new Wallet();

    await expect(ChainXSHelper.isNamedAccount(wallet.getAddress(ChainXSAddressType.CONTRACT_ACCOUNT))).toBe(false);
    await expect(ChainXSHelper.isNamedAccount(wallet.getAddress(ChainXSAddressType.EXTERNALLY_OWNED_ACCOUNT))).toBe(false);
    await expect(ChainXSHelper.isNamedAccount(wallet.getAddress(ChainXSAddressType.EXTERNALLY_OWNED_SMART_ACCOUNT))).toBe(false);
    await expect(ChainXSHelper.isNamedAccount('@named_account')).toBe(true);
    await expect(ChainXSHelper.isNamedAccount(wallet.getAddress(ChainXSAddressType.STEALTH_ADDRESS_ACCOUNT))).toBe(false);
    await expect(ChainXSHelper.isNamedAccount(wallet.getAddress(ChainXSAddressType.ZERO_ACCOUNT))).toBe(false);
});

test('address types SAA', async () => {
    const wallet = new Wallet();

    await expect(ChainXSHelper.isStealthAddress(wallet.getAddress(ChainXSAddressType.CONTRACT_ACCOUNT))).toBe(false);
    await expect(ChainXSHelper.isStealthAddress(wallet.getAddress(ChainXSAddressType.EXTERNALLY_OWNED_ACCOUNT))).toBe(false);
    await expect(ChainXSHelper.isStealthAddress(wallet.getAddress(ChainXSAddressType.EXTERNALLY_OWNED_SMART_ACCOUNT))).toBe(false);
    await expect(ChainXSHelper.isStealthAddress('@named_account')).toBe(false);
    await expect(ChainXSHelper.isStealthAddress(wallet.getAddress(ChainXSAddressType.STEALTH_ADDRESS_ACCOUNT))).toBe(true);
    await expect(ChainXSHelper.isStealthAddress(wallet.getAddress(ChainXSAddressType.ZERO_ACCOUNT))).toBe(false);
});

test('address types ZA', async () => {
    const wallet = new Wallet();

    await expect(ChainXSHelper.isZeroAddress(wallet.getAddress(ChainXSAddressType.CONTRACT_ACCOUNT))).toBe(false);
    await expect(ChainXSHelper.isZeroAddress(wallet.getAddress(ChainXSAddressType.EXTERNALLY_OWNED_ACCOUNT))).toBe(false);
    await expect(ChainXSHelper.isZeroAddress(wallet.getAddress(ChainXSAddressType.EXTERNALLY_OWNED_SMART_ACCOUNT))).toBe(false);
    await expect(ChainXSHelper.isZeroAddress('@named_account')).toBe(false);
    await expect(ChainXSHelper.isZeroAddress(wallet.getAddress(ChainXSAddressType.STEALTH_ADDRESS_ACCOUNT))).toBe(false);
    await expect(ChainXSHelper.isZeroAddress(wallet.getAddress(ChainXSAddressType.ZERO_ACCOUNT))).toBe(true);
});