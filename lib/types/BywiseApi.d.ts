import { Tx, BywiseNode, SimulateTx, Slice, TxOutput, InfoNode, TxBlockchainInfo, PublishedTx } from '.';
import { WalletInfo } from '../utils';
import { PublishedBlock } from './Block';
import { CountType } from './BywiseNode';
import { PublishedSlice } from './Slice';
export declare type BywiseResponse<T> = {
    data: T;
    error?: string;
};
export declare class BywiseApi {
    private debug;
    constructor(debug?: boolean);
    private get;
    private post;
    getBlocks(node: BywiseNode, parameters: {
        height?: number;
        from?: string;
        lastHash?: string;
        offset?: number;
        limit?: number;
        asc?: boolean;
    }): Promise<BywiseResponse<PublishedBlock[]>>;
    countBlocks(node: BywiseNode, parameters: {
        height?: number;
        from?: string;
    }): Promise<BywiseResponse<CountType>>;
    getBlockByHash(node: BywiseNode, hash: string): Promise<BywiseResponse<PublishedBlock>>;
    getSlicesFromBlock(node: BywiseNode, blockHash: string): Promise<BywiseResponse<PublishedSlice[]>>;
    publishNewSlice(node: BywiseNode, slice: Slice): Promise<BywiseResponse<void>>;
    getSlices(node: BywiseNode, parameters: {
        from?: string;
        lastBlockHash?: string;
        offset?: number;
        limit?: number;
        asc?: boolean;
    }): Promise<BywiseResponse<PublishedSlice[]>>;
    countSlices(node: BywiseNode, parameters: {
        from?: string;
        lastBlockHash?: string;
    }): Promise<BywiseResponse<CountType>>;
    getSliceByHash(node: BywiseNode, hash: string): Promise<BywiseResponse<PublishedSlice>>;
    getTransactionsFromSlice(node: BywiseNode, sliceHash: string): Promise<BywiseResponse<PublishedTx[]>>;
    publishNewTransaction(node: BywiseNode, tx: Tx): Promise<BywiseResponse<void>>;
    getTxs(node: BywiseNode, parameters: {
        from?: string[];
        to?: string[];
        foreignKeys?: string[];
        tag?: string;
        type?: string;
        status?: string;
        validator?: string;
        offset?: number;
        limit?: number;
        asc?: boolean;
    }): Promise<BywiseResponse<PublishedTx[]>>;
    countTxs(node: BywiseNode, parameters: {
        from?: string[];
        to?: string[];
        foreignKeys?: string[];
        tag?: string;
        type?: string;
        status?: string;
        validator?: string;
    }): Promise<BywiseResponse<CountType>>;
    getTransactionByHash(node: BywiseNode, hash: string): Promise<BywiseResponse<PublishedTx>>;
    getTxBlockchainInfo(node: BywiseNode, hash: string): Promise<BywiseResponse<TxBlockchainInfo>>;
    getFeeTransaction(node: BywiseNode, simulateTx: SimulateTx): Promise<BywiseResponse<TxOutput>>;
    getWalletInfo(node: BywiseNode, address: string): Promise<BywiseResponse<WalletInfo>>;
    countWallets(node: BywiseNode): Promise<BywiseResponse<CountType>>;
    tryToken(node: BywiseNode): Promise<BywiseResponse<void>>;
    getInfo(host: string): Promise<BywiseResponse<InfoNode>>;
    tryHandshake(host: string, myNode: BywiseNode): Promise<BywiseResponse<BywiseNode>>;
}
