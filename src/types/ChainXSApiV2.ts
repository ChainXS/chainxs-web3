import axios, { AxiosResponse } from 'axios';
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
        let response: ChainXSResponse<any> = { data: {} };

        try {
            const res: AxiosResponse<any> = await axios.get(url, {
                params: parameters,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Node ${token}` } : {}),
                },
                timeout: 30000,
            });

            response.data = res.data;
            if (this.debug) {
                console.log(`response`, response.data);
            }

        } catch (err: any) {
            response.error = err.response ? `${err.response.statusText}: ${err.response.data.error}` : err.message;
            response.data = err.response ? err.response.data : {};
        }

        if (this.debug) {
            console.log(`get ${url}`);
            if (response.error) {
                console.log(response.error, response.data);
            }
        }

        return response;
    }

    private async post(url: string, token: string | undefined, parameters: any = {}): Promise<ChainXSResponse<any>> {
        let response: ChainXSResponse<any> = { data: {} };

        try {
            const res: AxiosResponse<any> = await axios.post(url, parameters, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Node ${token}` } : {}),
                },
                timeout: 30000,
            });

            response.data = res.data;
            if (this.debug) {
                console.log(`response`, response.data);
            }

        } catch (err: any) {
            response.error = err.response ? `${err.response.statusText}: ${err.response.data.error}` : err.message;
            response.data = err.response ? err.response.data : {};
        }

        if (this.debug) {
            console.log(`post ${url}`);
            if (response.error) {
                console.log(response.error, response.data);
            }
        }

        return response;
    }

    publishNewBlock(node: ChainXSNode, block: Block): Promise<ChainXSResponse<void>> {
        return this.post(`${node.host}/api/v2/blocks`, node.token, block);
    }

    getBlocks(node: ChainXSNode, chain: string, parameters: { status?: string, offset?: number, limit?: number, asc?: boolean } = {}): Promise<ChainXSResponse<PublishedBlock[]>> {
        return this.get(`${node.host}/api/v2/blocks/last/${chain}`, node.token, parameters);
    }

    countBlocks(node: ChainXSNode, chain: string, parameters: { status?: string } = {}): Promise<ChainXSResponse<CountType>> {
        return this.get(`${node.host}/api/v2/blocks/count/${chain}`, node.token, parameters);
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
        return this.get(`${node.host}/api/v2/slices/last/${chain}`, node.token, parameters);
    }

    countSlices(node: ChainXSNode, chain: string, parameters: { status?: string } = {}): Promise<ChainXSResponse<CountType>> {
        return this.get(`${node.host}/api/v2/slices/count/${chain}`, node.token, parameters);
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
        return this.get(`${node.host}/api/v2/transactions/last/${chain}`, node.token, parameters);
    }

    countTxs(node: ChainXSNode, parameters: { chain?: string, find?: { searchBy: 'address' | 'from' | 'to' | 'key' | 'status', value: string } }): Promise<ChainXSResponse<CountType>> {
        return this.get(`${node.host}/api/v2/transactions/count`, node.token, parameters);
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
