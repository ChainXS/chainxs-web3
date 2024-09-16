import { ChainXSAddressType } from "./ChainXSHelper";
export type SignFunction = (hash: string) => Promise<string>;
export declare class Wallet {
    readonly seed: string;
    readonly publicKey: string;
    readonly address: string;
    private readonly account;
    constructor(seed?: string);
    getExtendedPublicKey: (account: number) => string;
    getAddress: (type: ChainXSAddressType) => string;
    getStealthAddress: (account: number, index: number) => string;
    signHash: SignFunction;
    signStealthAddressHash: (hash: string, account: number, index: number) => Promise<string>;
    signStealthAddressFunction: (account: number, index: number) => SignFunction;
}
export type WalletInfo = {
    balance: string;
    address: string;
    name?: string;
    photo?: string;
    url?: string;
    bio?: string;
    publicKey?: string;
};
