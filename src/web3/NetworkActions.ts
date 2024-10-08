import { ChainXSApiV2, ChainXSNode, ChainXSResponse } from "../types";
import { ChainXSApiV2_WS } from "../types/ChainXSApiV2_WS";

export type SendAction = (node: ChainXSNode) => Promise<ChainXSResponse<any>>
export type FilterAction<T> = (node: ChainXSNode) => Promise<T | undefined>

export type NetworkConfigs = {
    isClient: boolean,
    myHost: string,
    initialNodes: string[],
    maxConnectedNodes: number,
    createConnection?: () => Promise<ChainXSNode>
    debug: boolean,
};

export class NetworkActions {
    private readonly apiWS: ChainXSApiV2_WS;
    private readonly api: ChainXSApiV2;
    public readonly isClient: boolean;
    public readonly myHost: string;
    public readonly maxConnectedNodes: number;
    public initialNodes: string[];
    public isConnected: boolean = false;
    public connectedNodes: ChainXSNode[] = [];
    public knowHosts: string[] = [];

    constructor(configs: NetworkConfigs) {
        this.maxConnectedNodes = configs.maxConnectedNodes;
        this.api = new ChainXSApiV2(configs.debug);
        this.apiWS = new ChainXSApiV2_WS(configs.debug);
        this.initialNodes = configs.initialNodes;
        this.myHost = configs.myHost;
        this.isClient = configs.isClient;
        if (configs.createConnection) {
            this.createConnection = configs.createConnection
        }
    }

    private createConnection = async () => {
        return new ChainXSNode({});
    }

    exportConnections = () => {
        return {
            isConnected: this.isConnected,
            connectedNodes: this.connectedNodes,
        }
    }

    importConnections = async (payload: any) => {
        this.isConnected = payload.isConnected;
        this.connectedNodes = payload.connectedNodes;
    }

    getAPI(node: ChainXSNode) {
        if(node.host.startsWith("ws")) {
            return this.apiWS;
        } else {
            return this.api;
        }
    }

    private async tryConnectNode(host: string): Promise<ChainXSNode | null> {
        let myNode = undefined;
        if (!this.isClient) {
            myNode = await this.createConnection();
            if (myNode.host === host) {
                return null;
            }
        }
        let handshake;
        if(host.startsWith("ws")) {
            handshake = await this.apiWS.tryHandshake(host, myNode);
        } else {
            handshake = await this.api.tryHandshake(host, myNode);
        }
        if (!handshake.error) {
            handshake.data.host = host;
            return handshake.data;
        }
        return null;
    }

    async connect(initialNodes?: string[]) {
        if (initialNodes !== undefined) {
            this.initialNodes = initialNodes;
        }
        const now = Math.floor(Date.now() / 1000);
        let connectedNodes: ChainXSNode[] = [];
        for (let i = this.connectedNodes.length - 1; i >= 0; i--) {
            const node = this.connectedNodes[i];
            if (node.expire && node.expire < now) {
                const updateNode = await this.tryConnectNode(node.host);
                if (updateNode) {
                    connectedNodes.push(updateNode);
                }
            } else {
                connectedNodes.push(node);
            }
        }
        for (let i = 0; i < this.initialNodes.length; i++) {
            const host = this.initialNodes[i];
            let found = false;
            for (let j = 0; j < connectedNodes.length && !found; j++) {
                const node = connectedNodes[j];
                if (node.host === host) {
                    found = true;
                }
            }
            if (!found && connectedNodes.length < this.maxConnectedNodes) {
                const newNode = await this.tryConnectNode(host);
                if (newNode) {
                    connectedNodes.push(newNode);
                }
            }
        }
        const knowHosts: string[] = [];
        for (let i = connectedNodes.length - 1; i >= 0; i--) {
            const node = connectedNodes[i];
            const req =  await this.getAPI(node).tryToken(node);
            if (req.error) {
                connectedNodes = connectedNodes.filter(n => n.host !== node.host);
            } else {
                if (!knowHosts.includes(node.host)) {
                    knowHosts.push(node.host);
                }
                const nodes = req.data.nodes;
                for (let j = 0; j < nodes.length; j++) {
                    const knowNode = nodes[j];
                    if (!knowHosts.includes(knowNode.host)) {
                        knowHosts.push(knowNode.host);
                    }
                }
            }
        }
        for (let i = 0; i < knowHosts.length; i++) {
            const host = knowHosts[i];
            let found = false;
            for (let j = 0; j < connectedNodes.length && !found; j++) {
                const node = connectedNodes[j];
                if (node.host === host) {
                    found = true;
                }
            }
            if (!found && connectedNodes.length < this.maxConnectedNodes) {
                const newNode = await this.tryConnectNode(host);
                if (newNode) {
                    connectedNodes.push(newNode);
                }
            }
        }

        let isConnected = false;
        if (connectedNodes.length === 0) {
            isConnected = true;
        }
        if (connectedNodes.length > 0) {
            isConnected = true;
        }
        this.connectedNodes = connectedNodes;
        this.knowHosts = knowHosts;
        this.isConnected = isConnected;
        return this.isConnected;
    }

    disconnect() {
        this.apiWS.disconnect();
        this.connectedNodes = [];
        this.knowHosts = [];
        this.isConnected = false;
    }

    async testConnections() {
        let success = this.initialNodes.length === 0;
        for (let i = this.connectedNodes.length - 1; i >= 0 && !success; i--) {
            const node = this.connectedNodes[i];
            const req =  await this.getAPI(node).tryToken(node);
            if (req.error) {
                this.connectedNodes = this.connectedNodes.filter(n => n.host !== node.host);
            } else {
                success = true;
            }
        }
        return success;
    }

    addNode = (node: ChainXSNode) => {
        if (node.host === this.myHost) {
            return;
        }
        for (let i = 0; i < this.connectedNodes.length; i++) {
            const connectedNode = this.connectedNodes[i];
            if (connectedNode.host === node.host) {
                connectedNode.address = node.address;
                connectedNode.chains = node.chains;
                connectedNode.expire = node.expire;
                connectedNode.token = node.token;
                connectedNode.version = node.version;
                return;
            }
        }
        this.connectedNodes.push(node);
    }

    getRandomNode = (chain?: string) => {
        if (!this.isConnected) throw new Error('First connect to blockchain - "web3.network.connect()"');
        let chainNodes: ChainXSNode[] = [];
        if (chain) {
            this.connectedNodes.forEach(n => {
                if (n.chains.includes(chain)) {
                    chainNodes.push(n);
                }
            })
        } else {
            chainNodes = this.connectedNodes.map(n => n);
        }
        return chainNodes[Math.floor(Math.random() * (chainNodes.length - 1))];
    }

    async sendAll(sendAction: SendAction, chain?: string): Promise<string | undefined> {
        if (!this.isConnected) throw new Error('First connect to blockchain - "web3.network.connect()"');
        let error: string | undefined = undefined;
        let success = false;
        for (let i = 0; i < this.connectedNodes.length; i++) {
            const node = this.connectedNodes[i];
            if (chain === undefined || node.chains.includes(chain)) {
                let req = await sendAction(node);
                if (!req.error) {
                    success = true;
                } else {
                    error = req.error;
                }
            }
        }
        if (success) {
            return undefined;
        }
        return error;
    }

    async findAll<T>(filterAction: FilterAction<T>, chain?: string): Promise<T | undefined> {
        if (!this.isConnected) throw new Error('First connect to blockchain - "web3.network.connect()"');
        for (let i = 0; i < this.connectedNodes.length; i++) {
            const node = this.connectedNodes[i];
            if (chain === undefined || node.chains.includes(chain)) {
                let req = await filterAction(node);
                if (req !== undefined) {
                    return req;
                }
            }
        }
    }
}