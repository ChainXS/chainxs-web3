export class InfoAddress {
    public readonly version: string;
    public readonly isMainnet: boolean;
    public readonly isContract: boolean;
    public readonly ethAddress: string;
    public readonly tag: string;

    constructor(config: { version: string, isMainnet: boolean, isContract: boolean, ethAddress: string, tag: string }) {
        this.version = config.version;
        this.isMainnet = config.isMainnet;
        this.isContract = config.isContract;
        this.ethAddress = config.ethAddress;
        this.tag = config.tag;
    }
}