import { Block } from "./Block";
import { ChainXSTransaction } from "./ChainXSTransaction";
import { Slice } from "./Slice";
export declare enum TxType {
    TX_NONE = 0,
    TX_COMMAND = 1,
    TX_JSON = 2,
    TX_CONTRACT = 3
}
export type TransactionEvent = {
    contract: string;
    name: string;
    entries: string[];
};
export type TxOutput = {
    error?: string;
    stack?: string;
    logs?: string[];
    output: string;
    fee: string;
    ctx: string;
    get: string[][];
    set: string[][];
    events: TransactionEvent[];
};
export declare class Tx implements ChainXSTransaction {
    version: string;
    chain: string;
    validator: string[];
    from: string[];
    debit: string[];
    to: string[];
    amount: string[];
    type: number;
    data: string[];
    output: TxOutput;
    created: number;
    hash: string;
    sign: string[];
    validatorSign: string[];
    constructor(tx?: Partial<Tx>);
    toHash(): string;
    isValid(): void;
}
export type TxSyncOutput = {
    tx: Tx;
    slice: string;
};
export type SimulateTx = {
    chain: string;
    from: string[] | string;
    to: string[] | string;
    amount: string[] | string;
    foreignKeys?: string[];
    type: number;
    data: any;
};
export type SimulateContract = {
    code?: string;
    method?: string;
    inputs?: string[];
    from: string;
    contractAddress?: string;
    amount: number;
    env: any;
};
export type OutputSimulateContract = {
    error?: string;
    stack?: string;
    output: any;
    env: any;
};
export type PublishedTx = {
    version: string;
    validator?: string[];
    from: string[];
    to: string[];
    amount: string[];
    fee: string;
    type: string;
    foreignKeys?: string[];
    data: any;
    created: number;
    hash: string;
    validatorSign?: string[];
    sign: string[];
    status: string;
    output: TxOutput;
};
export type TxBlockchainInfo = {
    tx: PublishedTx;
    slice?: Slice;
    block?: Block;
};
