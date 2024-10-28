import { Tx, ChainXSNode, SimulateTx, Slice, TxOutput, InfoNode, PublishedTx, ChainXSResponse, BlockPack, OutputSimulateContract, SimulateContract } from '.';
import { ChainXSHelper, WalletInfo } from '../utils';
import { Block, PublishedBlock } from './Block';
import { CountType } from './ChainXSNode';
import { PublishedSlice } from './Slice';
import ws from 'ws';

const genRanHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

export type WSResponse = {
    id: string;
    status: number;
    body: any;
}

export type WSRequest = {
    id: string;
    path: string;
    method: string;
    token?: string;
    query: { [key: string]: string };
    body: any;
}

export class ChainXSApiV2_WS {

    private debug: boolean;
    private connections: Map<string, ws> = new Map();
    private requests: Map<string, WSResponse> = new Map();

    constructor(debug?: boolean) {
        this.debug = debug !== undefined ? debug : false;
    }

    private async getSocket(host: string): Promise<ws> {
        let client = this.connections.get(host);
        if (client) {
            return client;
        }
        client = new ws(host);
        this.connections.set(host, client);
        let isOpen = false;
        let error = false;
        client.on('open', () => {
            if (this.debug) {
                console.log(`connected ${host}`)
            }
            isOpen = true;
        });
        client.on('message', data => {
            const res: WSResponse = JSON.parse(data.toString());
            this.requests.set(res.id, res);
        });
        client.on('close', () => {
            this.connections.delete(host);
        })
        client.on('error', data => {
            error = true;
        })
        for (let i = 0; i < 300 && !isOpen; i++) {
            await ChainXSHelper.sleep(100);
            if (error) {
                this.connections.delete(host);
                throw new Error("Failed connection");
            }
        }
        if (!isOpen) {
            this.connections.delete(host);
            client.close();
            throw new Error("timeout");
        }
        return client;
    }

    private async get(host: string, path: string, token: string | undefined, parameters: any = {}): Promise<ChainXSResponse<any>> {
        const req: WSRequest = {
            id: genRanHex(40),
            path: path,
            method: "GET",
            token,
            query: {},
            body: {},
        }
        Object.entries(parameters).map(([key, value]) => {
            req.query[key] = `${value}`;
        });

        const response: ChainXSResponse<any> = {
            data: {}
        };
        try {
            const client = await this.getSocket(host);
            client.send(JSON.stringify(req));
            for (let i = 0; i < 300; i++) {
                await ChainXSHelper.sleep(100);
                const res = this.requests.get(req.id);
                if (res) {
                    this.requests.delete(req.id);
                    if (res.status < 200 || res.status >= 300) {
                        response.error = `${res.body.error}`;
                    }
                    response.data = res.body;
                    if (this.debug) {
                        console.log(`get ${host}${path}`)
                        if (response.error) {
                            console.log(response.error, response.data)
                        }
                    }
                    return response;
                }
            }
            client.close();
            throw new Error("timeout");
        } catch (err: any) {
            this.connections.delete(host);
            response.data = { error: err.message };
            response.error = `${err.message}`;
        }
        if (this.debug) {
            console.log(`get ${host}${path}`)
            if (response.error) {
                console.log(response.error, response.data)
            }
        }
        return response;
    }

    private async post(host: string, path: string, token: string | undefined, parameters: any = {}, broadcast?: boolean): Promise<ChainXSResponse<any>> {
        const req = {
            id: genRanHex(40),
            broadcast: broadcast,
            path: path,
            method: "POST",
            token,
            query: {},
            body: parameters,
        }
        const response: ChainXSResponse<any> = {
            data: {}
        };
        try {
            const client = await this.getSocket(host);
            client.send(JSON.stringify(req));
            if (!broadcast) {
                for (let i = 0; i < 300; i++) {
                    await ChainXSHelper.sleep(100);
                    const res = this.requests.get(req.id);
                    if (res) {
                        this.requests.delete(req.id);
                        if (res.status < 200 || res.status >= 300) {
                            response.error = `${res.body.error}`;
                        }
                        response.data = res.body;
                        if (this.debug) {
                            console.log(`post ${host}${path}`)
                            if (response.error) {
                                console.log(response.error, response.data)
                            }
                        }
                        return response;
                    }
                }
                client.close();
                throw new Error("timeout");
            }
        } catch (err: any) {
            this.connections.delete(host);
            response.data = { error: err.message };
            response.error = `${err.message}`;
        }
        if (this.debug) {
            console.log(`post ${host}${path}`)
            if (response.error) {
                console.log(response.error, response.data)
            }
        }
        return response;
    }

    disconnect() {
        for (let [key, client] of this.connections) {
            try {
                client.close();
            } catch (err) {
            }
        }
        this.connections = new Map();
        this.requests = new Map();
    }

    publishNewBlock(node: ChainXSNode, block: Block): Promise<ChainXSResponse<void>> {
        return this.post(node.host, `/api/v2/blocks`, node.token, block, true);
    }

    getBlocks(node: ChainXSNode, chain: string, parameters: { status?: string, offset?: number, limit?: number, asc?: boolean } = {}): Promise<ChainXSResponse<PublishedBlock[]>> {
        let query: any = {};
        if (parameters.offset !== undefined) query.offset = parameters.offset
        if (parameters.limit !== undefined) query.limit = parameters.limit
        if (parameters.asc !== undefined) query.asc = parameters.asc
        if (parameters.status !== undefined) query.status = parameters.status
        return this.get(node.host, `/api/v2/blocks/last/${chain}`, node.token, query);
    }

    countBlocks(node: ChainXSNode, chain: string, parameters: { status?: string } = {}): Promise<ChainXSResponse<CountType>> {
        let query: any = {};
        if (parameters.status !== undefined) query.status = parameters.status
        return this.get(node.host, `/api/v2/blocks/count/${chain}`, node.token, query);
    }

    getBlockByHash(node: ChainXSNode, hash: string): Promise<ChainXSResponse<PublishedBlock>> {
        return this.get(node.host, `/api/v2/blocks/hash/${hash}`, node.token);
    }

    getBlockByHeight(node: ChainXSNode, chain: string, height: number): Promise<ChainXSResponse<Block>> {
        return this.get(node.host, `/api/v2/blocks/height/${chain}/${height}`, node.token);
    }

    getBlockPackByHeight(node: ChainXSNode, chain: string, height: number): Promise<ChainXSResponse<BlockPack>> {
        return this.get(node.host, `/api/v2/blocks/pack/${chain}/${height}`, node.token);
    }

    getSlicesFromBlock(node: ChainXSNode, blockHash: string): Promise<ChainXSResponse<PublishedSlice[]>> {
        return this.get(node.host, `/api/v2/blocks/slices/${blockHash}`, node.token);
    }

    publishNewSlice(node: ChainXSNode, slice: Slice): Promise<ChainXSResponse<void>> {
        return this.post(node.host, `/api/v2/slices`, node.token, slice, true);
    }

    getSlices(node: ChainXSNode, chain: string, parameters: { status?: string, offset?: number, limit?: number, asc?: boolean }): Promise<ChainXSResponse<PublishedSlice[]>> {
        let query: any = {};
        if (parameters.offset !== undefined) query.offset = parameters.offset
        if (parameters.limit !== undefined) query.limit = parameters.limit
        if (parameters.asc !== undefined) query.asc = parameters.asc
        if (parameters.status !== undefined) query.status = parameters.status
        return this.get(node.host, `/api/v2/slices/last/${chain}`, node.token, query);
    }

    countSlices(node: ChainXSNode, chain: string, parameters: { status?: string } = {}): Promise<ChainXSResponse<CountType>> {
        let query: any = {};
        if (parameters.status !== undefined) query.status = parameters.status
        return this.get(node.host, `/api/v2/slices/count/${chain}`, node.token, query);
    }

    getSliceByHash(node: ChainXSNode, hash: string): Promise<ChainXSResponse<PublishedSlice>> {
        return this.get(node.host, `/api/v2/slices/hash/${hash}`, node.token);
    }

    getTransactionsFromSlice(node: ChainXSNode, sliceHash: string): Promise<ChainXSResponse<PublishedTx[]>> {
        return this.get(node.host, `/api/v2/slices/transactions/${sliceHash}`, node.token);
    }

    publishNewTransaction(node: ChainXSNode, tx: Tx): Promise<ChainXSResponse<void>> {
        return this.post(node.host, `/api/v2/transactions`, node.token, tx, true);
    }

    validadeTransaction(node: ChainXSNode, tx: Tx): Promise<ChainXSResponse<PublishedTx>> {
        return this.post(node.host, `/api/v2/transactions/validate`, node.token, tx, false);
    }

    getTxs(node: ChainXSNode, chain: string, parameters: { offset?: number, limit?: number, asc?: boolean, find?: { searchBy: 'address' | 'from' | 'to' | 'key' | 'status', value: string } }): Promise<ChainXSResponse<PublishedTx[]>> {
        let query: any = {};
        if (parameters.find) {
            query.searchBy = parameters.find.searchBy
            query.value = parameters.find.value
        }
        if (parameters.offset !== undefined) query.offset = parameters.offset;
        if (parameters.limit !== undefined) query.limit = parameters.limit;
        if (parameters.asc !== undefined) query.asc = parameters.asc;
        return this.get(node.host, `/api/v2/transactions/last/${chain}`, node.token, query);
    }

    countTxs(node: ChainXSNode, parameters: { chain?: string, find?: { searchBy: 'address' | 'from' | 'to' | 'key' | 'status', value: string } }): Promise<ChainXSResponse<CountType>> {
        let query: any = {};
        if (parameters.find) {
            query.searchBy = parameters.find.searchBy
            query.value = parameters.find.value
        }
        if (parameters.chain !== undefined) query.chain = parameters.chain;
        return this.get(node.host, `/api/v2/transactions/count`, node.token, query);
    }

    getTransactionByHash(node: ChainXSNode, hash: string): Promise<ChainXSResponse<PublishedTx>> {
        return this.get(node.host, `/api/v2/transactions/hash/${hash}`, node.token);
    }

    getFeeTransaction(node: ChainXSNode, simulateTx: SimulateTx): Promise<ChainXSResponse<TxOutput>> {
        return this.post(node.host, `/api/v2/transactions/fee`, node.token, simulateTx);
    }

    getContractByAddress(node: ChainXSNode, chain: string, address: string): Promise<ChainXSResponse<TxOutput>> {
        return this.get(node.host, `/api/v2/contracts/abi/${chain}/${address}`, node.token);
    }

    getContractEventByAddress(node: ChainXSNode, chain: string, address: string, event: string, byKey?: { key: string, value: string }): Promise<ChainXSResponse<TxOutput>> {
        return this.get(node.host, `/api/v2/contracts/events/${chain}/${address}/${event}`, node.token, byKey);
    }

    trySimulate(node: ChainXSNode, simulateTx: SimulateContract): Promise<ChainXSResponse<OutputSimulateContract>> {
        return this.post(node.host, `/api/v2/contracts/simulate`, node.token, simulateTx);
    }

    getWalletInfo(node: ChainXSNode, address: string, chain: string): Promise<ChainXSResponse<WalletInfo>> {
        return this.get(node.host, `/api/v2/wallets/${address}/${chain}`, node.token);
    }

    tryToken(node: ChainXSNode): Promise<ChainXSResponse<InfoNode>> {
        return this.get(node.host, `/api/v2/nodes/try-token`, node.token);
    }

    getInfo(host: string): Promise<ChainXSResponse<InfoNode>> {
        return this.get(host, `/api/v2/nodes/info`, undefined);
    }

    tryHandshake(host: string, myNode?: ChainXSNode): Promise<ChainXSResponse<ChainXSNode>> {
        return this.post(host, `/api/v2/nodes/handshake`, undefined, myNode ?? {});
    }
}