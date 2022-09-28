import { PublishedSlice, PublishedTx, Slice } from "../types";
import { Web3 } from "./Web3";
export declare class SlicesActions {
    private readonly web3;
    constructor(web3: Web3);
    sendSlice: (slice: Slice) => Promise<boolean>;
    findLastSlices: (limit?: number) => Promise<PublishedSlice[]>;
    getSliceByHash: (sliceHash: string) => Promise<PublishedSlice | undefined>;
    getSlices: (parameters?: {
        from?: string;
        lastBlockHash?: string;
        offset?: number;
        limit?: number;
        asc?: boolean;
    }) => Promise<PublishedSlice[] | undefined>;
    countSlices: (parameters?: {
        from?: string;
        lastBlockHash?: string;
    }) => Promise<number | undefined>;
    getTransactionsFromSlice: (sliceHash: string) => Promise<PublishedTx[] | undefined>;
}
