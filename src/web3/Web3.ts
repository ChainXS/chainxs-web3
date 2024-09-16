import { Network, ChainXSNode, ChainXSApiV2 } from "../types";
import { WalletsActions } from "./WalletsActions";
import { BlocksActions } from "./BlocksActions";
import { NetworkActions, NetworkConfigs } from "./NetworkActions";
import { SlicesActions } from "./SlicesActions";
import { TransactionsActions } from "./TransactionsActions";
import { ContractActions } from "./ContractActions";
import { ChainXSApiV2_WS } from "../types/ChainXSApiV2_WS";


const defaultNetwork: { mainnet: Network, testnet: Network } = {
    mainnet: {
        chain: 'mainnet',
        nodes: [
            'https://node0.chainxs.com.br',
            'https://node1.chainxs.com.br',
        ],
        explorer: 'https://explorer.chainxs.com.br'
    },
    testnet: {
        chain: 'testnet',
        nodes: [
            'https://testnet-node0.chainxs.com.br',
            'https://testnet-node1.chainxs.com.br',
        ],
        explorer: 'https://testnet.chainxs.com.br'
    },
}

export class Web3 {
    public readonly wallets: WalletsActions;
    public readonly network: NetworkActions;
    public readonly contracts: ContractActions;
    public readonly transactions: TransactionsActions;
    public readonly blocks: BlocksActions;
    public readonly slices: SlicesActions;
    private readonly debug: boolean = false;

    static async tryToken(node: ChainXSNode) {
        if(node.host.startsWith("ws")) {
            const apiWS = new ChainXSApiV2_WS();
            const req = await apiWS.tryToken(node);
            apiWS.disconnect();
            return req;
        } else {
            const api = new ChainXSApiV2();
            return await api.tryToken(node);
        }
    }

    constructor(configs?: { initialNodes?: string[], maxConnectedNodes?: number, myHost?: string, createConnection?: () => Promise<ChainXSNode>, getChains?: () => Promise<string[]>, debug?: boolean }) {
        if (configs) {
            this.debug = configs.debug ? configs.debug : false;
        }
        let networkConfigs: NetworkConfigs = {
            initialNodes: defaultNetwork.mainnet.nodes,
            isClient: false,
            maxConnectedNodes: 10,
            myHost: '',
            createConnection: undefined,
            debug: this.debug,
        }
        if (configs) {
            if (configs.maxConnectedNodes) {
                networkConfigs.maxConnectedNodes = configs.maxConnectedNodes;
            }
            if (configs.createConnection || configs.getChains) {
                networkConfigs.createConnection = configs.createConnection;
                networkConfigs.isClient = false;
            }
            if (configs.myHost) {
                networkConfigs.myHost = configs.myHost;
                networkConfigs.isClient = false;
            }
            if (configs.initialNodes) {
                networkConfigs.initialNodes = configs.initialNodes;
            }
        }
        this.network = new NetworkActions(networkConfigs);
        this.transactions = new TransactionsActions(this);
        this.contracts = new ContractActions(this);
        this.wallets = new WalletsActions(this);
        this.blocks = new BlocksActions(this);
        this.slices = new SlicesActions(this);
    }
}