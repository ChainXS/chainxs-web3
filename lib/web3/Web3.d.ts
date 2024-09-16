import { ChainXSNode } from "../types";
import { WalletsActions } from "./WalletsActions";
import { BlocksActions } from "./BlocksActions";
import { NetworkActions } from "./NetworkActions";
import { SlicesActions } from "./SlicesActions";
import { TransactionsActions } from "./TransactionsActions";
import { ContractActions } from "./ContractActions";
export declare class Web3 {
    readonly wallets: WalletsActions;
    readonly network: NetworkActions;
    readonly contracts: ContractActions;
    readonly transactions: TransactionsActions;
    readonly blocks: BlocksActions;
    readonly slices: SlicesActions;
    private readonly debug;
    static tryToken(node: ChainXSNode): Promise<import("../types").ChainXSResponse<import("../types").InfoNode>>;
    constructor(configs?: {
        initialNodes?: string[];
        maxConnectedNodes?: number;
        myHost?: string;
        createConnection?: () => Promise<ChainXSNode>;
        getChains?: () => Promise<string[]>;
        debug?: boolean;
    });
}
