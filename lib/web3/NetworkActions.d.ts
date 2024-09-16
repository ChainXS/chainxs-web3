import { ChainXSApiV2, ChainXSNode, ChainXSResponse } from "../types";
import { ChainXSApiV2_WS } from "../types/ChainXSApiV2_WS";
export type SendAction = (node: ChainXSNode) => Promise<ChainXSResponse<any>>;
export type FilterAction<T> = (node: ChainXSNode) => Promise<T | undefined>;
export type NetworkConfigs = {
    isClient: boolean;
    myHost: string;
    initialNodes: string[];
    maxConnectedNodes: number;
    createConnection?: () => Promise<ChainXSNode>;
    debug: boolean;
};
export declare class NetworkActions {
    private readonly apiWS;
    private readonly api;
    readonly isClient: boolean;
    readonly myHost: string;
    readonly maxConnectedNodes: number;
    initialNodes: string[];
    isConnected: boolean;
    connectedNodes: ChainXSNode[];
    knowHosts: string[];
    constructor(configs: NetworkConfigs);
    private createConnection;
    exportConnections: () => {
        isConnected: boolean;
        connectedNodes: ChainXSNode[];
    };
    importConnections: (payload: any) => Promise<void>;
    getAPI(node: ChainXSNode): ChainXSApiV2 | ChainXSApiV2_WS;
    private tryConnectNode;
    connect(initialNodes?: string[]): Promise<boolean>;
    disconnect(): void;
    testConnections(): Promise<boolean>;
    addNode: (node: ChainXSNode) => void;
    getRandomNode: (chain?: string) => ChainXSNode;
    sendAll(sendAction: SendAction, chain?: string): Promise<string | undefined>;
    findAll<T>(filterAction: FilterAction<T>, chain?: string): Promise<T | undefined>;
}
