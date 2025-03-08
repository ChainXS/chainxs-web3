import { ChainXSNode, PublishedTx, SimulateTx, Tx, TxOutput, TxSyncOutput, TxType } from "../types";
import { ChainXSHelper, SignFunction, Wallet } from "../utils";
import { Web3 } from "./Web3";

type BlockchainConfig = {
    name: string;
    input: string[];
}

class ConfigTransactions {
    private readonly web3: Web3;

    constructor(web3: Web3) {
        this.web3 = web3;
    }

    private async toTransaction(wallet: Wallet, chain: string, cfg: BlockchainConfig, type: TxType) {
        const tx = await this.web3.transactions.buildSimpleTx(
            wallet,
            chain,
            ChainXSHelper.ZERO_ADDRESS,
            '0',
            type,
            cfg
        );
        tx.isValid();
        return tx;
    }

    voteBlock(wallet: Wallet, chain: string, hash: string, height: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'vote-block',
            input: [hash, `${height}`]
        }, TxType.TX_COMMAND)
    }

    startSlice(wallet: Wallet, chain: string, height: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'start-slice',
            input: [`${height}`]
        }, TxType.TX_COMMAND)
    }

    stopSlice(wallet: Wallet, chain: string, height: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'stop-slice',
            input: [`${height}`]
        }, TxType.TX_COMMAND)
    }

    setConfigBlockTime(wallet: Wallet, chain: string, delay: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['blockTime', `${delay}`]
        }, TxType.TX_COMMAND)
    }

    setConfigFeeBasic(wallet: Wallet, chain: string, coef: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['feeBasic', `${coef}`]
        }, TxType.TX_COMMAND)
    }

    setConfigFeeCoefSize(wallet: Wallet, chain: string, coef: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['feeCoefSize', `${coef}`]
        }, TxType.TX_COMMAND)
    }

    setConfigFeeCoefAmount(wallet: Wallet, chain: string, coef: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['feeCoefAmount', `${coef}`]
        }, TxType.TX_COMMAND)
    }

    setConfigFeeCoefCost(wallet: Wallet, chain: string, coef: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['feeCoefCost', `${coef}`]
        }, TxType.TX_COMMAND)
    }

    setConfigPOI(wallet: Wallet, chain: string, count: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['poi', `${count}`]
        }, TxType.TX_COMMAND)
    }

    setConfigExecuteLimit(wallet: Wallet, chain: string, limit: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['executeLimit', `${limit}`]
        }, TxType.TX_COMMAND)
    }

    setConfigSizeLimit(wallet: Wallet, chain: string, limit: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['sizeLimit', `${limit}`]
        }, TxType.TX_COMMAND)
    }

    setInfoName(wallet: Wallet, chain: string, name: string): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setInfo',
            input: ['name', name]
        }, TxType.TX_COMMAND)
    }

    setInfoBio(wallet: Wallet, chain: string, bio: string): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setInfo',
            input: ['bio', bio]
        }, TxType.TX_COMMAND)
    }

    setInfoUrl(wallet: Wallet, chain: string, url: string): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setInfo',
            input: ['url', url]
        }, TxType.TX_COMMAND)
    }

    setInfoPhoto(wallet: Wallet, chain: string, photo: string): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setInfo',
            input: ['photo', photo]
        }, TxType.TX_COMMAND)
    }

    setInfoPublicKey(wallet: Wallet, chain: string, publicKey: string): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setInfo',
            input: ['publicKey', publicKey]
        }, TxType.TX_COMMAND)
    }

    addAdmin(wallet: Wallet, chain: string, address: string): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'addAdmin',
            input: [address]
        }, TxType.TX_COMMAND)
    }

    removeAdmin(wallet: Wallet, chain: string, address: string): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'removeAdmin',
            input: [address]
        }, TxType.TX_COMMAND)
    }

    addValidator(wallet: Wallet, chain: string, address: string, type: 'block' | 'slice'): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'addValidator',
            input: [address, type]
        }, TxType.TX_COMMAND)
    }

    removeValidator(wallet: Wallet, chain: string, address: string, type: 'block' | 'slice'): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'removeValidator',
            input: [address, type]
        }, TxType.TX_COMMAND)
    }

    setBalance(wallet: Wallet, chain: string, address: string, balance: string): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setBalance',
            input: [address, balance]
        }, TxType.TX_COMMAND)
    }

    addBalance(wallet: Wallet, chain: string, address: string, balance: string): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'addBalance',
            input: [address, balance]
        }, TxType.TX_COMMAND)
    }

    subBalance(wallet: Wallet, chain: string, address: string, balance: string): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'subBalance',
            input: [address, balance]
        }, TxType.TX_COMMAND)
    }
}

export class TransactionsActions {
    private readonly web3: Web3;
    public buildConfig;

    constructor(web3: Web3) {
        this.web3 = web3;
        this.buildConfig = new ConfigTransactions(web3);
    }

    buildSimpleTx = async (wallet: Wallet, chain: string, to: string | string[], amount: string | string[], type?: TxType, data?: any, foreignKeys?: string[]): Promise<Tx> => {
        const node = await this.web3.network.getRandomNode();
        const info = await this.web3.network.getAPI(node).getInfo(node.host);
        let tx = new Tx();
        tx.chain = chain;
        tx.version = "3";
        tx.from = [wallet.address];
        tx.to = Array.isArray(to) ? to : [to];
        tx.amount = Array.isArray(amount) ? amount : [amount];
        tx.type = type ? type : TxType.TX_NONE;
        if (type) {
            tx.data = data ? data : [];
        } else {
            tx.data = [];
        }
        tx.created = info.data.timestamp;
        tx.output = (await this.estimateFee(tx));
        tx.hash = tx.toHash();
        tx.sign = [await wallet.signHash(tx.hash)];
        return tx;
    }

    estimateFee = async (tx: Tx): Promise<TxOutput> => {
        let simulateTx: SimulateTx = {
            chain: tx.chain,
            from: tx.from,
            to: tx.to,
            amount: tx.amount,
            type: tx.type,
            data: tx.data,
        };
        const node = this.web3.network.getRandomNode();
        let simulate = await this.web3.network.getAPI(node).getFeeTransaction(node, simulateTx);
        if (simulate.error) {
            throw new Error(`Internal error - details: ${simulate.error}`)
        };
        if (simulate.data.error) {
            throw new Error(`Can't simulate transaction - details: ${simulate.data.error}`)
        };
        return simulate.data;
    }

    sendTransactionSync = async (tx: Tx, sign: SignFunction[], timeoutInSeconds: number = 60): Promise<TxSyncOutput> => {
        const node = this.web3.network.getRandomNode();
        tx.validator = [node.address];

        const simulate = await this.web3.network.getAPI(node).getFeeTransaction(node, tx);
        if (simulate.error) {
            throw new Error(`Internal error - details: ${simulate.error}`)
        };
        if (simulate.data.error) {
            throw new Error(`Can't simulate transaction - details: ${simulate.data.error}`)
        };
        tx.output = simulate.data;
        tx.hash = tx.toHash();
        tx.sign = [];
        for (let i = 0; i < sign.length; i++) {
            tx.sign.push(await sign[i](tx.hash));
        }

        const finalTx = await this.web3.network.getAPI(node).validadeTransaction(node, tx);
        if (finalTx.error) {
            throw new Error(`Internal error - details: ${finalTx.error}`)
        };

        let confirmed = false;
        let success = false;
        let output: TxSyncOutput = {
            tx: tx,
            slice: '',
        };
        for (let i = 0; i < timeoutInSeconds && !confirmed; i++) {
            const slice: any = await this.web3.network.getAPI(node).getSliceByHash(node, tx.output.ctx);
            if (!slice.error && slice.data.nextSlice) {
                const nextSlice = await this.web3.network.getAPI(node).getSliceByHash(node, slice.data.nextSlice);
                if (!nextSlice.error && nextSlice.data.transactions.includes(tx.hash)) {
                    success = true;
                    output.slice = nextSlice.data.hash
                }
                confirmed = true;
            }
            await ChainXSHelper.sleep(1000);
        }
        if (!success) {
            throw new Error(`Timeout - txid: ${tx.hash}`)
        };
        return output;
    }

    sendTransaction = async (tx: Tx): Promise<string | undefined> => {
        return await this.web3.network.sendAll(async (node) => {
            return await this.web3.network.getAPI(node).publishNewTransaction(node, tx);
        });
    }

    validateTransaction = async (node: ChainXSNode, tx: Tx): Promise<PublishedTx | null> => {
        let req = await this.web3.network.getAPI(node).validadeTransaction(node, tx);
        if (!req.error) {
            return req.data;
        }
        return null;
    }

    getTransactionByHash = async (txHash: string): Promise<PublishedTx | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.getAPI(node).getTransactionByHash(node, txHash);
            if (!req.error) {
                return req.data;
            }
        });
    }

    getTxs = async (chain: string, parameters: { offset?: number, limit?: number, asc?: boolean, find?: { searchBy: 'address' | 'from' | 'to' | 'key' | 'status', value: string } } = {}): Promise<PublishedTx[] | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.getAPI(node).getTxs(node, chain, parameters);
            if (!req.error) {
                return req.data;
            }
        });
    }

    countTxs = async (parameters: { chain?: string, find?: { searchBy: 'address' | 'from' | 'to' | 'key' | 'status', value: string } } = {}): Promise<number | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.getAPI(node).countTxs(node, parameters);
            if (!req.error) {
                return req.data.count;
            }
        });
    }

    waitConfirmation = async (tx: Tx, timeoutInSeconds: number = 60): Promise<string | undefined> => {
        const node = this.web3.network.getRandomNode();

        for (let i = 0; i < timeoutInSeconds; i++) {
            const slice: any = await this.web3.network.getAPI(node).getSliceByHash(node, tx.output.ctx);
            if (!slice.error && slice.data.nextSlice) {
                const nextSlice = await this.web3.network.getAPI(node).getSliceByHash(node, slice.data.nextSlice);
                if (!nextSlice.error && nextSlice.data.transactions.includes(tx.hash)) {
                    return nextSlice.data.hash
                }
            }
            await ChainXSHelper.sleep(1000);
        }
        return undefined;
    }
}