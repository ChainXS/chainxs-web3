export declare enum ChainXSAddressType {
    ZERO_ACCOUNT = 0,
    EXTERNALLY_OWNED_ACCOUNT = 1,
    EXTERNALLY_OWNED_SMART_ACCOUNT = 2,
    STEALTH_ADDRESS_ACCOUNT = 3,
    CONTRACT_ACCOUNT = 4,
    NAMED_ACCOUNT = 5
}
export type AddressInfo = {
    typeAddress: ChainXSAddressType;
    bwsAddress: string;
    ethAddress: string;
};
export declare class ChainXSHelper {
    static readonly ZERO_ADDRESS = "000000000000000000000000000000000";
    static readonly ETH_ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
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
    static isValidBase64: (amount: string) => boolean;
    static isValidAmount: (amount: string) => boolean;
    static isValidSignedAmount: (amount: string) => boolean;
    static isValidAlfaNum: (value: string) => boolean;
    static isValidAlfaNumSlash: (value: string) => boolean;
    static isValidInteger: (height: number) => boolean;
    static isValidDate: (date: number) => boolean;
    static isValidSign: (sign: string, address: string, hash: string) => boolean;
    static jsonToString: (mainJson: any) => string;
    static numberToHex: (number: number) => string;
    static bigintToHexString: (value: bigint, bytes?: number) => string;
    static sleep: (ms: number) => Promise<void>;
    static bigintToBase64String: (value: bigint) => string;
    static Base64Tobigint: (value: string) => bigint;
    static HexStringToBase64String: (hexString: string) => string;
    static Base64StringToHexString: (base64String: string) => string;
    static Base64AmountToHex32: (value: string) => string;
}
