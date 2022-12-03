import { BywisePack } from "./BywisePack";
import { BywiseTransaction } from "./BywiseTransaction";
export declare class Slice implements BywiseTransaction, BywisePack {
    height: number;
    transactions: string[];
    version: string;
    chain: string;
    from: string;
    created: string;
    lastBlockHash: string;
    hash: string;
    sign: string;
    constructor(slice?: Partial<Slice>);
    validatorHash(): string;
    getMerkleRoot(): string;
    toHash(): string;
    isValid(): void;
}
export declare type PublishedSlice = {
    height: number;
    transactions: string[];
    version: string;
    from: string;
    created: string;
    lastBlockHash: string;
    hash: string;
    sign: string;
    status: string;
};
