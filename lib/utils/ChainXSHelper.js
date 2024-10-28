"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainXSHelper = exports.ChainXSAddressType = void 0;
const ethers_1 = require("ethers");
var ChainXSAddressType;
(function (ChainXSAddressType) {
    ChainXSAddressType[ChainXSAddressType["ZERO_ACCOUNT"] = 0] = "ZERO_ACCOUNT";
    ChainXSAddressType[ChainXSAddressType["EXTERNALLY_OWNED_ACCOUNT"] = 1] = "EXTERNALLY_OWNED_ACCOUNT";
    ChainXSAddressType[ChainXSAddressType["EXTERNALLY_OWNED_SMART_ACCOUNT"] = 2] = "EXTERNALLY_OWNED_SMART_ACCOUNT";
    ChainXSAddressType[ChainXSAddressType["STEALTH_ADDRESS_ACCOUNT"] = 3] = "STEALTH_ADDRESS_ACCOUNT";
    ChainXSAddressType[ChainXSAddressType["CONTRACT_ACCOUNT"] = 4] = "CONTRACT_ACCOUNT";
    ChainXSAddressType[ChainXSAddressType["NAMED_ACCOUNT"] = 5] = "NAMED_ACCOUNT";
})(ChainXSAddressType || (exports.ChainXSAddressType = ChainXSAddressType = {}));
class ChainXSHelper {
    static makeHash(hexBytes) {
        return (0, ethers_1.sha256)((0, ethers_1.sha256)("0x" + hexBytes)).substring(2);
    }
}
exports.ChainXSHelper = ChainXSHelper;
ChainXSHelper.ZERO_ADDRESS = '000000000000000000000000000000000';
ChainXSHelper.ETH_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
ChainXSHelper.newContractAddress = (seed) => {
    if (!seed) {
        seed = Math.random().toString();
    }
    const addr = (0, ethers_1.sha256)('0x' + Buffer.from(seed, 'utf-8').toString('hex')).substring(0, 42);
    return ChainXSHelper.encodeBWSAddress(ChainXSAddressType.CONTRACT_ACCOUNT, addr);
};
ChainXSHelper.encodeBWSAddress = (type, ethAddress) => {
    if (!/^0x[0-9a-fA-F]{40}$/.test(ethAddress))
        throw new Error('invalid address');
    if (ethAddress === ChainXSHelper.ETH_ZERO_ADDRESS || type == ChainXSAddressType.ZERO_ACCOUNT) {
        return ChainXSHelper.ZERO_ADDRESS;
    }
    let typeAddress;
    let typeAddressId;
    if (type == ChainXSAddressType.EXTERNALLY_OWNED_ACCOUNT) {
        typeAddress = 'ob';
        typeAddressId = '1';
    }
    else if (type == ChainXSAddressType.EXTERNALLY_OWNED_SMART_ACCOUNT) {
        typeAddress = 'eb';
        typeAddressId = '2';
    }
    else if (type == ChainXSAddressType.STEALTH_ADDRESS_ACCOUNT) {
        typeAddress = 'sb';
        typeAddressId = '3';
    }
    else if (type == ChainXSAddressType.CONTRACT_ACCOUNT) {
        typeAddress = 'cb';
        typeAddressId = '4';
    }
    else {
        throw new Error('encode bws address');
    }
    const checkSum = typeAddressId + (0, ethers_1.sha256)(ethAddress).substring(2, 5);
    let finalAddress = (0, ethers_1.encodeBase58)(ethAddress + checkSum);
    while (finalAddress.length < 31) {
        finalAddress = "1" + finalAddress;
    }
    finalAddress = typeAddress + finalAddress;
    return finalAddress;
};
ChainXSHelper.decodeBWSAddress = (address) => {
    if (/^\@[0-9a-zA-Z_]{5,33}$/.test(address)) {
        return {
            bwsAddress: address,
            typeAddress: ChainXSAddressType.NAMED_ACCOUNT,
            ethAddress: ChainXSHelper.ETH_ZERO_ADDRESS
        };
    }
    if (/^[0]{33}$/.test(address)) {
        return {
            bwsAddress: address,
            typeAddress: ChainXSAddressType.ZERO_ACCOUNT,
            ethAddress: ChainXSHelper.ETH_ZERO_ADDRESS
        };
    }
    if (!/^[oesc][b][0-9a-zA-Z]{31}$/.test(address))
        throw new Error('invalid address');
    const addressTypeStr = address.substring(0, 2);
    let typeAddress;
    let typeAddressId;
    if (addressTypeStr === 'ob') {
        typeAddress = ChainXSAddressType.EXTERNALLY_OWNED_ACCOUNT;
        typeAddressId = '1';
    }
    else if (addressTypeStr === 'eb') {
        typeAddress = ChainXSAddressType.EXTERNALLY_OWNED_SMART_ACCOUNT;
        typeAddressId = '2';
    }
    else if (addressTypeStr === 'sb') {
        typeAddress = ChainXSAddressType.STEALTH_ADDRESS_ACCOUNT;
        typeAddressId = '3';
    }
    else if (addressTypeStr === 'cb') {
        typeAddress = ChainXSAddressType.CONTRACT_ACCOUNT;
        typeAddressId = '4';
    }
    else {
        throw new Error('invalid address');
    }
    let addressNumber = (0, ethers_1.decodeBase58)(address.substring(2));
    let hex = addressNumber.toString(16).toLowerCase();
    if (hex.length % 2) {
        hex = '0' + hex;
    }
    while (hex.length < 44) {
        hex = '00' + hex;
    }
    const ethAddress = "0x" + hex.substring(0, 40).toLowerCase();
    const checkSum = typeAddressId + (0, ethers_1.sha256)(ethAddress).substring(2, 5);
    if (checkSum !== hex.substring(40))
        throw new Error('invalid address');
    return {
        bwsAddress: address,
        typeAddress: typeAddress,
        ethAddress: ethAddress
    };
};
ChainXSHelper.isValidAddress = (address) => {
    try {
        ChainXSHelper.decodeBWSAddress(address);
        return true;
    }
    catch (err) {
        return false;
    }
};
ChainXSHelper.getStealthAddressFromExtendedPublicKey = (xpub, index) => {
    const node = ethers_1.ethers.HDNodeWallet.fromExtendedKey(xpub).derivePath(`${index}`);
    return ChainXSHelper.encodeBWSAddress(ChainXSAddressType.STEALTH_ADDRESS_ACCOUNT, node.address);
};
ChainXSHelper.isContractAddress = (address) => {
    return address.startsWith('c');
};
ChainXSHelper.isExternalOwnedAccount = (address) => {
    return address.startsWith('o');
};
ChainXSHelper.isExternaSmartAccount = (address) => {
    return address.startsWith('e');
};
ChainXSHelper.isNamedAccount = (address) => {
    return address.startsWith('@');
};
ChainXSHelper.isStealthAddress = (address) => {
    return address.startsWith('s');
};
ChainXSHelper.isZeroAddress = (address) => {
    return address === ChainXSHelper.ZERO_ADDRESS;
};
ChainXSHelper.isStringArray = (arr) => {
    if (!Array.isArray(arr))
        return false;
    for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] !== 'string')
            return false;
    }
    return true;
};
ChainXSHelper.isValidAmount = (amount) => {
    return /^(0|[1-9][0-9]{0,48})$/.test(amount);
};
ChainXSHelper.isValidSignedAmount = (amount) => {
    return /^(0|[\-]{0,1}[1-9][0-9]{0,48})$/.test(amount);
};
ChainXSHelper.isValidAlfaNum = (value) => {
    return /^[a-zA-Z0-9_]{0,64}$/.test(value);
};
ChainXSHelper.isValidAlfaNumSlash = (value) => {
    return /^[a-zA-Z0-9_\-]{1,300}$/.test(value);
};
ChainXSHelper.isValidHash = (value) => {
    return /^[a-f0-9]{64}$/.test(value);
};
ChainXSHelper.isValidInteger = (height) => {
    if (typeof height !== 'number')
        return false;
    return /^[0-9]{1,10}$/.test(`${height}`);
};
ChainXSHelper.isValidDate = (date) => {
    if (typeof date !== 'number')
        return false;
    return /^[0-9]{10}$/.test(`${date}`);
};
ChainXSHelper.isValidSign = (sign, address, hash) => {
    if (!/^0x[a-f0-9]{130}$/.test(sign)) {
        return false;
    }
    let decodedSignAddress = ChainXSHelper.decodeBWSAddress(address);
    let recoveredAddress = ethers_1.ethers.verifyMessage(hash, sign).toLowerCase();
    if (recoveredAddress !== decodedSignAddress.ethAddress) {
        return false;
    }
    return true;
};
ChainXSHelper.jsonToString = (mainJson) => {
    const toJSON = (json) => {
        let newJSON;
        if (Array.isArray(json)) {
            newJSON = json.map(value => toJSON(value));
        }
        else if (json === null || json === undefined) {
            newJSON = null;
        }
        else if (typeof json === 'object') {
            let obj = {};
            Object.entries(json).sort((a, b) => a[0].localeCompare(b[0], 'en')).forEach(([key, value]) => {
                obj[key] = toJSON(value);
            });
            newJSON = obj;
        }
        else {
            newJSON = json;
        }
        return newJSON;
    };
    return JSON.stringify(toJSON(mainJson));
};
ChainXSHelper.numberToHex = (number) => {
    let hex = number.toString(16);
    if ((hex.length % 2) > 0) {
        hex = "0" + hex;
    }
    while (hex.length < 16) {
        hex = "00" + hex;
    }
    if (hex.length > 16 || number < 0) {
        throw new Error(`invalid pointer "${number}"`);
    }
    return hex;
};
ChainXSHelper.sleep = function sleep(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => {
            setTimeout(resolve, ms + 10);
        });
    });
};
