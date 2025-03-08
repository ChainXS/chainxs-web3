import { ethers } from "ethers";
import { ChainXSAddressType, ChainXSHelper } from "./ChainXSHelper";

export type SignFunction = (hash: string) => Promise<string>

export class Wallet {
    public readonly seed: string;
    public readonly publicKey: string;
    public readonly address: string;
    private readonly account: ethers.HDNodeWallet;

    constructor(seed?: string) {
        if (seed) {
            this.seed = seed;
        } else {
            let mnemonic = ethers.Wallet.createRandom().mnemonic
            if (!mnemonic) throw new Error('cant generate mnemonic phrase')
            this.seed = mnemonic.phrase;
        }
        this.account = ethers.Wallet.fromPhrase(this.seed);
        this.publicKey = this.account.publicKey;
        this.address = this.getAddress(ChainXSAddressType.EXTERNALLY_OWNED_ACCOUNT);
    }

    getExtendedPublicKey = (account: number): string => {
        const node = ethers.HDNodeWallet.fromPhrase(this.seed).derivePath(`${account}'`);
        return node.neuter().extendedKey;
    }

    getAddress = (type: ChainXSAddressType): string => {
        return ChainXSHelper.encodeBWSAddress(type, this.account.address);
    }

    getStealthAddress = (account: number, index: number): string => {
        const node = ethers.HDNodeWallet.fromPhrase(this.seed).derivePath(`${account}'/${index}`);
        return ChainXSHelper.encodeBWSAddress(ChainXSAddressType.STEALTH_ADDRESS_ACCOUNT, node.address);
    }

    signHash: SignFunction = async (hash: string): Promise<string> => {
        hash = ChainXSHelper.Base64StringToHexString(hash);
        let sign = await this.account.signMessage(hash);
        sign = ChainXSHelper.HexStringToBase64String(sign);
        return sign;
    }

    signStealthAddressHash = async (hash: string, account: number, index: number): Promise<string> => {
        const node = ethers.HDNodeWallet.fromPhrase(this.seed).derivePath(`${account}'/${index}`);
        hash = ChainXSHelper.Base64StringToHexString(hash);
        let sign = (await node.signMessage(hash));
        sign = ChainXSHelper.HexStringToBase64String(sign);
        return sign
    }

    signStealthAddressFunction = (account: number, index: number): SignFunction => {
        const node = ethers.HDNodeWallet.fromPhrase(this.seed).derivePath(`${account}'/${index}`);
        return async (hash: string) => {
            return await node.signMessage(hash);
        };
    }
}

export type WalletInfo = {
    balance: string,
    address: string,
    name?: string,
    photo?: string,
    url?: string,
    bio?: string,
    publicKey?: string,
}