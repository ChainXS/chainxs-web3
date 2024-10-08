import { ChainXSTransaction } from "./ChainXSTransaction";
export type SliceData = {
    hash: string;
    data: string[];
};
export declare class Slice implements ChainXSTransaction {
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
    constructor(slice?: Partial<Slice>);
    private getMerkleRoot;
    toHash(): string;
    isValid(): void;
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
};
