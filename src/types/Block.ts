import { ChainXSHelper } from "../utils/ChainXSHelper";
import { ChainXSTransaction } from "./ChainXSTransaction";

export class Block implements ChainXSTransaction {
    height: number;
    slices: string[];
    transactionsCount: number;
    version: string;
    chain: string;
    from: string;
    created: number;
    lastHash: string;
    hash: string;
    sign: string;
    externalTxID: string[];

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
        this.externalTxID = block?.externalTxID ?? [];
    }

    private getMerkleRoot() {
        let merkleRoot = '';
        if (this.slices.length > 0) {
            this.slices.forEach(sliceHash => {
                merkleRoot += sliceHash;
            })
            merkleRoot = ChainXSHelper.makeHash(merkleRoot);
        } else {
            merkleRoot = '0000000000000000000000000000000000000000000000000000000000000000'
        }
        return merkleRoot
    }

    toHash(): string {
        let bytes = '';
        bytes += ChainXSHelper.numberToHex(this.height);
        bytes += ChainXSHelper.numberToHex(this.transactionsCount);
        bytes += Buffer.from(this.version, 'utf-8').toString('hex');
        if (this.version == '2') {
            bytes += Buffer.from(this.chain, 'utf-8').toString('hex');
        }
        bytes += Buffer.from(this.from, 'utf-8').toString('hex');
        bytes += ChainXSHelper.numberToHex(this.created);
        bytes += this.getMerkleRoot();
        bytes += this.lastHash;
        bytes = ChainXSHelper.makeHash(bytes);
        return bytes;
    }

    isValid(): void {
        if (!ChainXSHelper.isValidInteger(this.height)) throw new Error('invalid block height');
        if (!ChainXSHelper.isValidInteger(this.transactionsCount)) throw new Error('invalid block transactionsCount');
        if (!ChainXSHelper.isStringArray(this.slices)) throw new Error('invalid array');
        for (let i = 0; i < this.slices.length; i++) {
            let sliceHash = this.slices[i];
            if (!ChainXSHelper.isValidHash(sliceHash)) throw new Error(`invalid block hash ${i} - ${sliceHash}`);
        }
        if (this.version !== '2') throw new Error('invalid block version ' + this.version);
        if (this.chain.length === 0) throw new Error('invalid block chain cant be empty');
        if (!ChainXSHelper.isValidAlfaNum(this.chain)) throw new Error('invalid chain');
        if (!ChainXSHelper.isValidAddress(this.from)) throw new Error('invalid block from address ' + this.from);
        if (!ChainXSHelper.isValidDate(this.created)) throw new Error('invalid created date');
        if (!ChainXSHelper.isValidHash(this.lastHash)) throw new Error('invalid lastHash ' + this.lastHash);
        if (this.hash !== this.toHash()) throw new Error(`corrupt transaction`);
        if (!ChainXSHelper.isValidSign(this.sign, this.from, this.hash)) throw new Error('invalid block signature');

        if (!ChainXSHelper.isStringArray(this.externalTxID)) throw new Error('invalid array');
        for (let i = 0; i < this.externalTxID.length; i++) {
            let txId = this.externalTxID[i];
            if (!ChainXSHelper.isValidHash(txId)) throw new Error(`invalid externalTxID txId ${i} - ${txId}`);
        }
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