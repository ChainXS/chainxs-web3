import { ChainXSTransaction } from "./ChainXSTransaction";
export declare class Block implements ChainXSTransaction {
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
    constructor(block?: Partial<Block>);
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
