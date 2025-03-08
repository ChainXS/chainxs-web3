import { ChainXSHelper } from '../utils';

test('test hash message', async () => {
    const data = "Message to hash"

    const expected = "c06a88fc01b2eb86205c50af6406225c57b26975bd2acdd017847ec7978903f3"
    const hash = ChainXSHelper.makeHash(Buffer.from(data, 'utf-8').toString('hex'))

    await expect(hash).toBe(expected);
});

test('test hash bytes', async () => {
    const data = "c06a88fc01b2eb86205c50af6406225c57b26975bd2acdd017847ec7978903f3"

    const expected = "bdb3ab888d6029bbc02c8b422cc3ff8111e2ae44921d53badf1e8ed23bd45dcf"
    const hash = ChainXSHelper.makeHash(data)

    await expect(hash).toBe(expected);
});

test('test hash number', async () => {
    let data = '';

    let number1 = BigInt("18446744073709551615")
	let number2 = 4294967295

    data += ChainXSHelper.bigintToHexString(number1, 8);
    data += ChainXSHelper.numberToHex(number2);

    await expect(12).toBe(data.length / 2);

    const hash = ChainXSHelper.makeHash(data)
    const expected = "82a7d5bb59fc957ff7f737ca0b8be713c705d6173783ad5edb067819bed70be8"

    await expect(hash).toBe(expected);
});

test('test base64 to bigint', async () => {
    let data = "//////////8="
    let expected = BigInt("18446744073709551615")
    let number = ChainXSHelper.Base64Tobigint(data)
    await expect(number).toBe(expected);

    data = "JxA="
    expected = BigInt("10000")
    number = ChainXSHelper.Base64Tobigint(data)
    await expect(number).toBe(expected);

    data = ""
    expected = BigInt("0")
    number = ChainXSHelper.Base64Tobigint(data)
    await expect(number).toBe(expected);
});

test('test bigint to base64', async () => {
    let data = BigInt("18446744073709551615")
    let expected = "//////////8="
    let base64 = ChainXSHelper.bigintToBase64String(data)
    await expect(base64).toBe(expected);

    data = BigInt("10000")
    expected = "JxA="
    base64 = ChainXSHelper.bigintToBase64String(data)
    await expect(base64).toBe(expected);

    data = BigInt("0")
    expected = ""
    base64 = ChainXSHelper.bigintToBase64String(data)
    await expect(base64).toBe(expected);
});