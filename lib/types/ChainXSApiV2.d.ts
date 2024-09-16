import { Tx, ChainXSNode, SimulateTx, Slice, TxOutput, InfoNode, PublishedTx, ChainXSResponse, BlockPack, OutputSimulateContract, SimulateContract } from '.';
import { WalletInfo } from '../utils';
import { Block, PublishedBlock } from './Block';
import { CountType } from './ChainXSNode';
import { PublishedSlice } from './Slice';
export declare class ChainXSApiV2 {
    private debug;
    constructor(debug?: boolean);
    private get;
    private post;
    publishNewBlock(node: ChainXSNode, block: Block): Promise<ChainXSResponse<void>>;
    getBlocks(node: ChainXSNode, chain: string, parameters?: {
        status?: string;
        offset?: number;
        limit?: number;
        asc?: boolean;
    }): Promise<ChainXSResponse<PublishedBlock[]>>;
    countBlocks(node: ChainXSNode, chain: string, parameters?: {
        status?: string;
    }): Promise<ChainXSResponse<CountType>>;
    getBlockByHash(node: ChainXSNode, hash: string): Promise<ChainXSResponse<PublishedBlock>>;
    getBlockByHeight(node: ChainXSNode, chain: string, height: number): Promise<ChainXSResponse<Block>>;
    getBlockPackByHeight(node: ChainXSNode, chain: string, height: number): Promise<ChainXSResponse<BlockPack>>;
    getSlicesFromBlock(node: ChainXSNode, blockHash: string): Promise<ChainXSResponse<PublishedSlice[]>>;
    publishNewSlice(node: ChainXSNode, slice: Slice): Promise<ChainXSResponse<void>>;
    getSlices(node: ChainXSNode, chain: string, parameters: {
        status?: string;
        offset?: number;
        limit?: number;
        asc?: boolean;
    }): Promise<ChainXSResponse<PublishedSlice[]>>;
    countSlices(node: ChainXSNode, chain: string, parameters?: {
        status?: string;
    }): Promise<ChainXSResponse<CountType>>;
    getSliceByHash(node: ChainXSNode, hash: string): Promise<ChainXSResponse<PublishedSlice>>;
    getTransactionsFromSlice(node: ChainXSNode, sliceHash: string): Promise<ChainXSResponse<PublishedTx[]>>;
    publishNewTransaction(node: ChainXSNode, tx: Tx): Promise<ChainXSResponse<void>>;
    validadeTransaction(node: ChainXSNode, tx: Tx): Promise<ChainXSResponse<PublishedTx>>;
    getTxs(node: ChainXSNode, chain: string, parameters: {
        offset?: number;
        limit?: number;
        asc?: boolean;
        find?: {
            searchBy: 'address' | 'from' | 'to' | 'key' | 'status';
            value: string;
        };
    }): Promise<ChainXSResponse<PublishedTx[]>>;
    countTxs(node: ChainXSNode, parameters: {
        chain?: string;
        find?: {
            searchBy: 'address' | 'from' | 'to' | 'key' | 'status';
            value: string;
        };
    }): Promise<ChainXSResponse<CountType>>;
    getTransactionByHash(node: ChainXSNode, hash: string): Promise<ChainXSResponse<PublishedTx>>;
    getFeeTransaction(node: ChainXSNode, simulateTx: SimulateTx): Promise<ChainXSResponse<TxOutput>>;
    getContractByAddress(node: ChainXSNode, chain: string, address: string): Promise<ChainXSResponse<TxOutput>>;
    getContractEventByAddress(node: ChainXSNode, chain: string, address: string, event: string, byKey?: {
        key: string;
        value: string;
    }): Promise<ChainXSResponse<TxOutput>>;
    trySimulate(node: ChainXSNode, simulateTx: SimulateContract): Promise<ChainXSResponse<OutputSimulateContract>>;
    getWalletInfo(node: ChainXSNode, address: string, chain: string): Promise<ChainXSResponse<WalletInfo>>;
    tryToken(node: ChainXSNode): Promise<ChainXSResponse<InfoNode>>;
    getInfo(host: string): Promise<ChainXSResponse<InfoNode>>;
    tryHandshake(host: string, myNode?: ChainXSNode): Promise<ChainXSResponse<ChainXSNode>>;
}
