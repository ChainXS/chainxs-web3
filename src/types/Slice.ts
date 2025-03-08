import { ChainXSHelper } from "../utils/ChainXSHelper";
import { ChainXSTransaction } from "./ChainXSTransaction";

export type SliceData = {
    hash: string;
    data: string[];
}

export class Slice implements ChainXSTransaction {
    height: number;
    blockHeight: number;
    transactions: string[];
    transactionsCount: number;
    version: string;
    chain: string;
    from: string;
    created: number;
    end: boolean;
    lastHash: string;
    hash: string;
    sign: string;

    constructor(slice?: Partial<Slice>) {
        this.height = slice?.height ?? 0;
        this.blockHeight = slice?.blockHeight ?? 0;
        this.transactions = slice?.transactions ?? [];
        this.transactionsCount = slice?.transactionsCount ?? 0;
        this.version = slice?.version ?? '';
        this.chain = slice?.chain ?? '';
        this.from = slice?.from ?? '';
        this.created = slice?.created ?? 0;
        this.end = slice?.end ?? false;
        this.lastHash = slice?.lastHash ?? '';
        this.hash = slice?.hash ?? '';
        this.sign = slice?.sign ?? '';
    }

    private getMerkleRoot() {
        let merkleRoot = '';
        if (this.transactions.length > 0) {
            this.transactions.forEach(txHash => {
                merkleRoot += txHash;
            })
            merkleRoot = ChainXSHelper.makeHash(merkleRoot);
        } else {
            merkleRoot = '0000000000000000000000000000000000000000000000000000000000000000'
        }
        return merkleRoot
    }

    toHash(): string {
        let bytes = '';
        bytes += Buffer.from(this.version, 'utf-8').toString('hex');
        bytes += Buffer.from(this.chain, 'utf-8').toString('hex');
        bytes += ChainXSHelper.numberToHex(this.height);
        bytes += ChainXSHelper.numberToHex(this.blockHeight);
        bytes += ChainXSHelper.numberToHex(this.transactionsCount);
        bytes += ChainXSHelper.numberToHex(this.created);
        bytes += this.end ? '01' : '00';
        bytes += Buffer.from(this.from, 'utf-8').toString('hex');
        bytes += ChainXSHelper.Base64StringToHexString(this.lastHash);
        this.transactions.forEach(hash => {
            bytes += ChainXSHelper.Base64StringToHexString(hash);
        })
        
        bytes = ChainXSHelper.makeHash(bytes);
        return ChainXSHelper.HexStringToBase64String(bytes);
    }

    isValid(): void {
        if (!ChainXSHelper.isValidInteger(this.height)) throw new Error('invalid slice height');

        if (!ChainXSHelper.isValidInteger(this.blockHeight)) throw new Error('invalid slice blockHeight');

        if (!ChainXSHelper.isValidInteger(this.transactionsCount)) throw new Error('invalid slice transactionsCount');

        if (!ChainXSHelper.isStringArray(this.transactions)) throw new Error('invalid array');
        if (this.transactions.length === 0) throw new Error('invalid slice length');
        if (this.transactions.length !== this.transactionsCount) throw new Error('invalid slice length');
        for (let i = 0; i < this.transactions.length; i++) {
            let txHash = this.transactions[i];
            if (!ChainXSHelper.isValidBase64(txHash)) throw new Error(`invalid tx hash ${i} - ${txHash}`);
        }
        if (this.version !== '3') throw new Error('invalid version');
        if (this.chain.length === 0) throw new Error('invalid slice chain cant be empty');
        if (!ChainXSHelper.isValidAlfaNum(this.chain)) throw new Error('invalid chain');
        if (!ChainXSHelper.isValidBase64(this.lastHash)) throw new Error('invalid lastHash ' + this.lastHash);
        if (!ChainXSHelper.isValidAddress(this.from)) throw new Error('invalid slice from address ' + this.from);
        if (!ChainXSHelper.isValidDate(this.created)) throw new Error('invalid created date');
        if (this.end !== true && this.end !== false) throw new Error('invalid slice end flag');
        if (this.hash !== this.toHash()) throw new Error(`corrupt transaction`);
        if (!ChainXSHelper.isValidSign(this.sign, this.from, this.hash)) throw new Error('invalid slice signature');
    }
}

export type PublishedSlice = {
    height: number;
    blockHeight: number;
    transactions: string[];
    transactionsCount: number;
    version: string;
    from: string;
    created: number;
    end: boolean;
    lastHash: string;
    hash: string;
    sign: string;
    status: string;
}