export class ChainXSNode {
    version: string;
    chains: string[];
    host: string;
    address: string;
    expire?: number;
    token?: string;

    constructor(config: Partial<ChainXSNode>) {
        this.version = config.version ?? '';
        this.chains = config.chains ?? [];
        this.host = config.host ?? '';
        this.address = config.address ?? '';
        this.expire = config.expire;
        this.token = config.token;
    }
}

export type ConfigNode = {
    name: string;
    value: string;
    type: string;
}

export type InfoNode = {
    address: string;
    host: string;
    version: string;
    timestamp: number;
    chains: string[];
    explorers: string[];
    nodes: ChainXSNode[];
}

export type CountType = {
    count: number
}