import { ChainXSHelper } from "../utils/ChainXSHelper";
import { ChainXSTransaction } from "./ChainXSTransaction";

export class Block implements ChainXSTransaction {
    version: string;
    chain: string;
    height: number;
    transactionsCount: number;
    from: string;
    created: number;
    lastHash: string;
    slices: string[];
    hash: string;
    sign: string;

    constructor(block?: Partial<Block>) {
        this.height = block?.height ?? 0;
        this.slices = block?.slices ?? [];
        this.transactionsCount = block?.transactionsCount ?? 0;
        this.version = block?.version ?? '';
        this.chain = block?.chain ?? '';
        this.from = block?.from ?? '';
        this.created = block?.created ?? 0;
        this.lastHash = block?.lastHash ?? '';
        this.hash = block?.hash ?? '';
        this.sign = block?.sign ?? '';
    }

    toHash(): string {
        let bytes = '';
        bytes += Buffer.from(this.version, 'utf-8').toString('hex');
        bytes += Buffer.from(this.chain, 'utf-8').toString('hex');
        bytes += ChainXSHelper.numberToHex(this.height);
        bytes += ChainXSHelper.numberToHex(this.transactionsCount);
        bytes += Buffer.from(this.from, 'utf-8').toString('hex');
        bytes += ChainXSHelper.numberToHex(this.created);
        bytes += ChainXSHelper.Base64StringToHexString(this.lastHash);
        this.slices.forEach(sliceHash => {
            bytes += ChainXSHelper.Base64StringToHexString(sliceHash);
        })
        bytes = ChainXSHelper.makeHash(bytes);
        return ChainXSHelper.HexStringToBase64String(bytes);
    }

    isValid(): void {
        if (!ChainXSHelper.isValidInteger(this.height)) throw new Error('invalid block height');
        if (!ChainXSHelper.isValidInteger(this.transactionsCount)) throw new Error('invalid block transactionsCount');
        if (!ChainXSHelper.isStringArray(this.slices)) throw new Error('invalid array');
        for (let i = 0; i < this.slices.length; i++) {
            let sliceHash = this.slices[i];
            if (!ChainXSHelper.isValidBase64(sliceHash)) throw new Error(`invalid block hash ${i} - ${sliceHash}`);
        }
        if (this.version !== '2') throw new Error('invalid block version ' + this.version);
        if (this.chain.length === 0) throw new Error('invalid block chain cant be empty');
        if (!ChainXSHelper.isValidAlfaNum(this.chain)) throw new Error('invalid chain');
        if (!ChainXSHelper.isValidAddress(this.from)) throw new Error('invalid block from address ' + this.from);
        if (!ChainXSHelper.isValidDate(this.created)) throw new Error('invalid created date');
        if (!ChainXSHelper.isValidBase64(this.lastHash)) throw new Error('invalid lastHash ' + this.lastHash);
        if (this.hash !== this.toHash()) throw new Error(`corrupt transaction`);
        if (!ChainXSHelper.isValidSign(this.sign, this.from, this.hash)) throw new Error('invalid block signature');
    }
}

export type PublishedBlock = {
    height: number;
    slices: string[];
    transactionsCount: number;
    version: string;
    from: string;
    created: number;
    lastHash: string;
    hash: string;
    sign: string;
    externalTxID: string[];
    status: string;
}