import { ethers, encodeBase58, sha256, decodeBase58 } from "ethers";

export enum ChainXSAddressType {
    ZERO_ACCOUNT,
    EXTERNALLY_OWNED_ACCOUNT,
    EXTERNALLY_OWNED_SMART_ACCOUNT,
    STEALTH_ADDRESS_ACCOUNT,
    CONTRACT_ACCOUNT,
    NAMED_ACCOUNT,
}

export type AddressInfo = {
    typeAddress: ChainXSAddressType,
    bwsAddress: string,
    ethAddress: string,
}

export class ChainXSHelper {
    static readonly ZERO_ADDRESS = '000000000000000000000000000000000';
    static readonly ETH_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

    static makeHash(hexBytes: string) {
        return sha256(sha256("0x" + hexBytes)).substring(2);
    }

    static newContractAddress = (seed?: string) => {
        if (!seed) {
            seed = Math.random().toString();
        }
        const addr = sha256('0x' + Buffer.from(seed, 'utf-8').toString('hex')).substring(0, 42);
        return ChainXSHelper.encodeBWSAddress(ChainXSAddressType.CONTRACT_ACCOUNT, addr);
    }

    static encodeBWSAddress = (type: ChainXSAddressType, ethAddress: string) => {
        if (!/^0x[0-9a-fA-F]{40}$/.test(ethAddress)) throw new Error('invalid address');
        if (ethAddress === ChainXSHelper.ETH_ZERO_ADDRESS || type == ChainXSAddressType.ZERO_ACCOUNT) {
            return ChainXSHelper.ZERO_ADDRESS;
        }
        let typeAddress;
        let typeAddressId;
        if (type == ChainXSAddressType.EXTERNALLY_OWNED_ACCOUNT) {
            typeAddress = 'ob'
            typeAddressId = '1'
        } else if (type == ChainXSAddressType.EXTERNALLY_OWNED_SMART_ACCOUNT) {
            typeAddress = 'eb'
            typeAddressId = '2'
        } else if (type == ChainXSAddressType.STEALTH_ADDRESS_ACCOUNT) {
            typeAddress = 'sb'
            typeAddressId = '3'
        } else if (type == ChainXSAddressType.CONTRACT_ACCOUNT) {
            typeAddress = 'cb'
            typeAddressId = '4'
        } else {
            throw new Error('encode bws address');
        }
        const checkSum = typeAddressId + sha256(ethAddress).substring(2, 5);
        let finalAddress = encodeBase58(ethAddress + checkSum);
        while (finalAddress.length < 31) {
            finalAddress = "1" + finalAddress;
        }
        finalAddress = typeAddress + finalAddress;
        return finalAddress;
    }

    static decodeBWSAddress = (address: string): AddressInfo => {
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
        if (!/^[oesc][b][0-9a-zA-Z]{31}$/.test(address)) throw new Error('invalid address');

        const addressTypeStr = address.substring(0, 2);
        let typeAddress: ChainXSAddressType;
        let typeAddressId;
        if (addressTypeStr === 'ob') {
            typeAddress = ChainXSAddressType.EXTERNALLY_OWNED_ACCOUNT
            typeAddressId = '1'
        } else if (addressTypeStr === 'eb') {
            typeAddress = ChainXSAddressType.EXTERNALLY_OWNED_SMART_ACCOUNT
            typeAddressId = '2'
        } else if (addressTypeStr === 'sb') {
            typeAddress = ChainXSAddressType.STEALTH_ADDRESS_ACCOUNT
            typeAddressId = '3'
        } else if (addressTypeStr === 'cb') {
            typeAddress = ChainXSAddressType.CONTRACT_ACCOUNT
            typeAddressId = '4'
        } else {
            throw new Error('invalid address');
        }

        let addressNumber = decodeBase58(address.substring(2));
        let hex = addressNumber.toString(16).toLowerCase();
        if (hex.length % 2) {
            hex = '0' + hex;
        }
        while (hex.length < 44) {
            hex = '00' + hex;
        }
        const ethAddress = "0x" + hex.substring(0, 40).toLowerCase();
        const checkSum = typeAddressId + sha256(ethAddress).substring(2, 5);
        if (checkSum !== hex.substring(40)) throw new Error('invalid address');
        return {
            bwsAddress: address,
            typeAddress: typeAddress,
            ethAddress: ethAddress
        };
    }

    static isValidAddress = (address: string) => {
        try {
            ChainXSHelper.decodeBWSAddress(address);
            return true;
        } catch (err) {
            return false;
        }
    }

    static getStealthAddressFromExtendedPublicKey = (xpub: string, index: number): string => {
        const node = ethers.HDNodeWallet.fromExtendedKey(xpub).derivePath(`${index}`);
        return ChainXSHelper.encodeBWSAddress(ChainXSAddressType.STEALTH_ADDRESS_ACCOUNT, node.address);
    }

    static isContractAddress = (address: string) => {
        return address.startsWith('c');
    }

    static isExternalOwnedAccount = (address: string) => {
        return address.startsWith('o');
    }

    static isExternaSmartAccount = (address: string) => {
        return address.startsWith('e');
    }

    static isNamedAccount = (address: string) => {
        return address.startsWith('@');
    }

    static isStealthAddress = (address: string) => {
        return address.startsWith('s');
    }

    static isZeroAddress = (address: string) => {
        return address === ChainXSHelper.ZERO_ADDRESS;
    }

    static isStringArray = (arr: any) => {
        if (!Array.isArray(arr)) return false;
        for (let i = 0; i < arr.length; i++) {
            if (typeof arr[i] !== 'string') return false;
        }
        return true;
    }

    static isValidBase64 = (amount: string) => {
        return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(amount);
    }

    static isValidAmount = (amount: string) => {
        return /^(0|[1-9][0-9]{0,48})$/.test(amount);
    }

    static isValidSignedAmount = (amount: string) => {
        return /^(0|[\-]{0,1}[1-9][0-9]{0,48})$/.test(amount);
    }

    static isValidAlfaNum = (value: string) => {
        return /^[a-zA-Z0-9_]{0,64}$/.test(value);
    }

    static isValidAlfaNumSlash = (value: string) => {
        return /^[a-zA-Z0-9_\-]{1,300}$/.test(value);
    }

    static isValidInteger = (height: number) => {
        if (typeof height !== 'number') return false;
        return /^[0-9]{1,10}$/.test(`${height}`);
    }

    static isValidDate = (date: number) => {
        if (typeof date !== 'number') return false;
        return /^[0-9]{10}$/.test(`${date}`);
    }

    static isValidSign = (sign: string, address: string, hash: string) => {
        sign = "0x"+this.Base64StringToHexString(sign);
        hash = this.Base64StringToHexString(hash);
        if (!/^0x[a-f0-9]{130}$/.test(sign)) {
            return false;
        }
        if (!/^[a-f0-9]{64}$/.test(hash)) {
            return false;
        }
        let decodedSignAddress = ChainXSHelper.decodeBWSAddress(address);
        let recoveredAddress = ethers.verifyMessage(hash, sign).toLowerCase();
        if (recoveredAddress !== decodedSignAddress.ethAddress) {
            return false;
        }
        return true;
    }

    static jsonToString = (mainJson: any): string => {
        const toJSON: any = (json: any) => {
            let newJSON;
            if (Array.isArray(json)) {
                newJSON = json.map(value => toJSON(value))
            } else if (json === null || json === undefined) {
                newJSON = null;
            } else if (typeof json === 'object') {
                let obj: any = {};
                Object.entries(json).sort((a, b) => a[0].localeCompare(b[0], 'en')).forEach(([key, value]) => {
                    obj[key] = toJSON(value)
                })
                newJSON = obj;
            } else {
                newJSON = json;
            }
            return newJSON;
        }
        return JSON.stringify(toJSON(mainJson));
    }

    static numberToHex = (number: number) => {
        if (number > 0xFFFFFFFF) {
            throw new Error(`invalid number`);
        }
        let hex = number.toString(16);
        if ((hex.length % 2) > 0) {
            hex = "0" + hex;
        }
        while (hex.length < 8) {
            hex = "00" + hex;
        }
        if (hex.length > 8 || number < 0) {
            throw new Error(`invalid pointer "${number}"`);
        }
        return hex;
    }

    static bigintToHexString = (value: bigint, bytes: number = 8): string => {
        if (bytes !== 4 && bytes !== 8) {
            throw new Error("Bytes must be either 4 or 8.");
        }

        const hexStringLength = bytes * 2;

        const hexString = value.toString(16);

        if (hexString.length > hexStringLength) {
            throw new Error(`Value is too large to fit in ${bytes} bytes.`);
        }

        return hexString.padStart(hexStringLength, '0');
    }

    static sleep = async function sleep(ms: number) {
        await new Promise((resolve) => {
            setTimeout(resolve, ms + 10);
        });
    }

    static bigintToBase64String = (value: bigint): string => {
        const hexString = value.toString(16);
        const buffer = Buffer.from(hexString, 'hex');
        return buffer.toString('base64');
    }

    static Base64Tobigint = (value: string): bigint => {
        if(value === "") {
            return BigInt(0);
        }
        const buffer = Buffer.from(value, 'base64');
        return BigInt(`0x${buffer.toString('hex')}`);
    }

    static HexStringToBase64String = (hexString: string): string => {
        if(hexString.startsWith('0x')) {
            hexString = hexString.substring(2);
        }
        const buffer = Buffer.from(hexString, 'hex');
        return buffer.toString('base64');
    }

    static Base64StringToHexString = (base64String: string): string => {
        const buffer = Buffer.from(base64String, 'base64');
        return buffer.toString('hex');
    }

    static Base64AmountToHex32 = (value: string): string => {
        let hex = this.Base64StringToHexString(value);
        if(hex.length > 64) {
            throw new Error(`invalid base64 amount`);
        }
        while(hex.length < 64) {
            hex = "0" + hex
        }
        return hex;
    }
}