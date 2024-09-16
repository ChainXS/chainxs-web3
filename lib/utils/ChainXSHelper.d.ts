export declare enum ChainXSAddressType {
    ZA = "ZERO_ACCOUNT",
    NA = "NAMED_ACCOUNT",
    EOA = "EXTERNALLY_OWNED_ACCOUNT",
    ESA = "EXTERNALLY_OWNED_SMART_ACCOUNT",
    SAA = "STEALTH_ADDRESS_ACCOUNT",
    CA = "CONTRACT_ACCOUNT"
}
export type AddressInfo = {
    typeAddress: ChainXSAddressType;
    bwsAddress: string;
    ethAddress: string;
};
export declare class ChainXSHelper {
    static readonly ZERO_ADDRESS = "000000000000000000000000000000000";
    static makeHash(hexBytes: string): string;
    static newContractAddress: (seed?: string) => string;
    static encodeBWSAddress: (type: ChainXSAddressType, ethAddress: string) => string;
    static decodeBWSAddress: (address: string) => AddressInfo;
    static isValidAddress: (address: string) => boolean;
    static getStealthAddressFromExtendedPublicKey: (xpub: string, index: number) => string;
    static isContractAddress: (address: string) => boolean;
    static isExternalOwnedAccount: (address: string) => boolean;
    static isExternaSmartAccount: (address: string) => boolean;
    static isNamedAccount: (address: string) => boolean;
    static isStealthAddress: (address: string) => boolean;
    static isZeroAddress: (address: string) => address is "000000000000000000000000000000000";
    static isStringArray: (arr: any) => boolean;
    static isValidAmount: (amount: string) => boolean;
    static isValidSignedAmount: (amount: string) => boolean;
    static isValidAlfaNum: (value: string) => boolean;
    static isValidAlfaNumSlash: (value: string) => boolean;
    static isValidHash: (value: string) => boolean;
    static isValidInteger: (height: number) => boolean;
    static isValidDate: (date: number) => boolean;
    static isValidSign: (sign: string, address: string, hash: string) => boolean;
    static jsonToString: (mainJson: any) => string;
    static numberToHex: (number: number) => string;
    static sleep: (ms: number) => Promise<void>;
}
