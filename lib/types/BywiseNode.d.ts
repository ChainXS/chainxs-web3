export declare class BywiseNode {
    version: string;
    expire: number;
    chains: string[];
    host: string;
    address: string;
    token?: string;
    constructor(config: Partial<BywiseNode>);
}
export declare type ConfigNode = {
    name: string;
    value: string;
    type: string;
};
export declare type InfoNode = {
    address: string;
    host: string;
    version: string;
    timestamp: number;
    chains: string[];
    explorers: string[];
    nodes: BywiseNode[];
};
export declare type CountType = {
    count: number;
};
