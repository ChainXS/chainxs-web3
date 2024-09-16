import { Tx, ChainXSNode, SimulateTx, Slice, TxOutput, InfoNode, PublishedTx, ChainXSResponse, BlockPack, OutputSimulateContract, SimulateContract } from '.';
import { WalletInfo } from '../utils';
import { Block, PublishedBlock } from './Block';
import { CountType } from './ChainXSNode';
import { PublishedSlice } from './Slice';

export class ChainXSApiV2 {

    private debug: boolean;

    constructor(debug?: boolean) {
        this.debug = debug !== undefined ? debug : false;
    }

    private async get(url: string, token: string | undefined, parameters: any = {}): Promise<ChainXSResponse<any>> {
        let params = ''
        if (parameters) {
            params = '?' + (Object.entries(parameters).map(([key, value]) => {
                if (typeof value === 'object') {
                    return `${key}=${encodeURI(JSON.stringify(value))}`;
                }
                return `${key}=${encodeURI(`${value}`)}`;
            })).join('&');
        }
        let response: ChainXSResponse<any> = {
            data: {}
        };

        const AbortController = globalThis.AbortController
        const controller = new AbortController();
        const timeout = setTimeout(() => {
            controller.abort();
        }, 30000);

        try {
            const req = await fetch(url + params, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Node ${token}` } : {})
                },
            });
            response.data = await req.json();
            if (this.debug) {
                console.log(`response`, response.data)
            }
            if (req.status < 200 || req.status >= 300) {
                response.error = `${req.statusText} - ${response.data.error}`
            }
        } catch (err: any) {
            response.error = `${err.message}`;
            if (err.response) {
                response.data = err.response.data;
                response.error = `${err.response.data.error}`;
            }
        } finally {
            clearTimeout(timeout);
        }

        if (this.debug) {
            console.log(`get ${url + params}`)
            if (response.error) {
                console.log(response.error, response.data)
            }
        }
        return response;
    }

    private async post(url: string, token: string | undefined, parameters: any = {}): Promise<ChainXSResponse<any>> {
        let response: ChainXSResponse<any> = {
            data: {}
        };

        const AbortController = globalThis.AbortController
        const controller = new AbortController();
        const timeout = setTimeout(() => {
            controller.abort();
        }, 30000);

        try {
            const req = await fetch(url, {
                method: 'POST',
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Node ${token}` } : {})
                },
                body: JSON.stringify(parameters)
            });
            response.data = await req.json();

            if (this.debug) {
                console.log(`response`, response.data)
            }

            if (req.status < 200 || req.status >= 300) {
                response.error = `Error ${req.statusText}: ${response.data.error}`
            }
        } catch (err: any) {
            response.error = `${err.message}`;
            if (err.response) {
                response.data = err.response.data;
                response.error = `${err.response.statusText}: ${err.response.data.error}`;
            }
        } finally {
            clearTimeout(timeout);
        }

        if (this.debug) {
            console.log(`post ${url}`)
            if (response.error) {
                console.log(response.error, response.data)
            }
        }
        return response;
    }

    publishNewBlock(node: ChainXSNode, block: Block): Promise<ChainXSResponse<void>> {
        return this.post(`${node.host}/api/v2/blocks`, node.token, block);
    }

    getBlocks(node: ChainXSNode, chain: string, parameters: { status?: string, offset?: number, limit?: number, asc?: boolean } = {}): Promise<ChainXSResponse<PublishedBlock[]>> {
        let query: any = {};
        if (parameters.offset !== undefined) query.offset = parameters.offset
        if (parameters.limit !== undefined) query.limit = parameters.limit
        if (parameters.asc !== undefined) query.asc = parameters.asc
        if (parameters.status !== undefined) query.status = parameters.status
        return this.get(`${node.host}/api/v2/blocks/last/${chain}`, node.token, query);
    }

    countBlocks(node: ChainXSNode, chain: string, parameters: { status?: string } = {}): Promise<ChainXSResponse<CountType>> {
        let query: any = {};
        if (parameters.status !== undefined) query.status = parameters.status
        return this.get(`${node.host}/api/v2/blocks/count/${chain}`, node.token, query);
    }

    getBlockByHash(node: ChainXSNode, hash: string): Promise<ChainXSResponse<PublishedBlock>> {
        return this.get(`${node.host}/api/v2/blocks/hash/${hash}`, node.token);
    }

    getBlockByHeight(node: ChainXSNode, chain: string, height: number): Promise<ChainXSResponse<Block>> {
        return this.get(`${node.host}/api/v2/blocks/height/${chain}/${height}`, node.token);
    }

    getBlockPackByHeight(node: ChainXSNode, chain: string, height: number): Promise<ChainXSResponse<BlockPack>> {
        return this.get(`${node.host}/api/v2/blocks/pack/${chain}/${height}`, node.token);
    }

    getSlicesFromBlock(node: ChainXSNode, blockHash: string): Promise<ChainXSResponse<PublishedSlice[]>> {
        return this.get(`${node.host}/api/v2/blocks/slices/${blockHash}`, node.token);
    }

    publishNewSlice(node: ChainXSNode, slice: Slice): Promise<ChainXSResponse<void>> {
        return this.post(`${node.host}/api/v2/slices`, node.token, slice);
    }

    getSlices(node: ChainXSNode, chain: string, parameters: { status?: string, offset?: number, limit?: number, asc?: boolean }): Promise<ChainXSResponse<PublishedSlice[]>> {
        let query: any = {};
        if (parameters.offset !== undefined) query.offset = parameters.offset
        if (parameters.limit !== undefined) query.limit = parameters.limit
        if (parameters.asc !== undefined) query.asc = parameters.asc
        if (parameters.status !== undefined) query.status = parameters.status
        return this.get(`${node.host}/api/v2/slices/last/${chain}`, node.token, query);
    }

    countSlices(node: ChainXSNode, chain: string, parameters: { status?: string } = {}): Promise<ChainXSResponse<CountType>> {
        let query: any = {};
        if (parameters.status !== undefined) query.status = parameters.status
        return this.get(`${node.host}/api/v2/slices/count/${chain}`, node.token, query);
    }

    getSliceByHash(node: ChainXSNode, hash: string): Promise<ChainXSResponse<PublishedSlice>> {
        return this.get(`${node.host}/api/v2/slices/hash/${hash}`, node.token);
    }

    getTransactionsFromSlice(node: ChainXSNode, sliceHash: string): Promise<ChainXSResponse<PublishedTx[]>> {
        return this.get(`${node.host}/api/v2/slices/transactions/${sliceHash}`, node.token);
    }

    publishNewTransaction(node: ChainXSNode, tx: Tx): Promise<ChainXSResponse<void>> {
        return this.post(`${node.host}/api/v2/transactions`, node.token, tx);
    }
    
    validadeTransaction(node: ChainXSNode, tx: Tx): Promise<ChainXSResponse<PublishedTx>> {
        return this.post(`${node.host}/api/v2/transactions/validate`, node.token, tx);
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
        return this.get(`${node.host}/api/v2/transactions/last/${chain}`, node.token, query);
    }

    countTxs(node: ChainXSNode, parameters: { chain?: string, find?: { searchBy: 'address' | 'from' | 'to' | 'key' | 'status', value: string } }): Promise<ChainXSResponse<CountType>> {
        let query: any = {};
        if (parameters.find) {
            query.searchBy = parameters.find.searchBy
            query.value = parameters.find.value
        }
        if (parameters.chain !== undefined) query.chain = parameters.chain;
        return this.get(`${node.host}/api/v2/transactions/count`, node.token, query);
    }

    getTransactionByHash(node: ChainXSNode, hash: string): Promise<ChainXSResponse<PublishedTx>> {
        return this.get(`${node.host}/api/v2/transactions/hash/${hash}`, node.token);
    }

    getFeeTransaction(node: ChainXSNode, simulateTx: SimulateTx): Promise<ChainXSResponse<TxOutput>> {
        return this.post(`${node.host}/api/v2/transactions/fee`, node.token, simulateTx);
    }

    getContractByAddress(node: ChainXSNode, chain: string, address: string): Promise<ChainXSResponse<TxOutput>> {
        return this.get(`${node.host}/api/v2/contracts/abi/${chain}/${address}`, node.token);
    }

    getContractEventByAddress(node: ChainXSNode, chain: string, address: string, event: string, byKey?: { key: string, value: string }): Promise<ChainXSResponse<TxOutput>> {
        return this.get(`${node.host}/api/v2/contracts/events/${chain}/${address}/${event}`, node.token, byKey);
    }

    trySimulate(node: ChainXSNode, simulateTx: SimulateContract): Promise<ChainXSResponse<OutputSimulateContract>> {
        return this.post(`${node.host}/api/v2/contracts/simulate`, node.token, simulateTx);
    }

    getWalletInfo(node: ChainXSNode, address: string, chain: string): Promise<ChainXSResponse<WalletInfo>> {
        return this.get(`${node.host}/api/v2/wallets/${address}/${chain}`, node.token);
    }

    tryToken(node: ChainXSNode): Promise<ChainXSResponse<InfoNode>> {
        return this.get(`${node.host}/api/v2/nodes/try-token`, node.token);
    }

    getInfo(host: string): Promise<ChainXSResponse<InfoNode>> {
        return this.get(`${host}/api/v2/nodes/info`, undefined);
    }

    tryHandshake(host: string, myNode?: ChainXSNode): Promise<ChainXSResponse<ChainXSNode>> {
        return this.post(`${host}/api/v2/nodes/handshake`, undefined, myNode ?? {});
    }
}