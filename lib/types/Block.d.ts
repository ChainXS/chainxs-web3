import { ChainXSTransaction } from "./ChainXSTransaction";
export declare class Block implements ChainXSTransaction {
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
    constructor(block?: Partial<Block>);
    private getMerkleRoot;
    toHash(): string;
    isValid(): void;
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
};
