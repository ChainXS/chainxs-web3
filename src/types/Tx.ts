import { ChainXSHelper } from "../utils/ChainXSHelper";
import { Block } from "./Block";
import { ChainXSTransaction } from "./ChainXSTransaction";
import { Slice } from "./Slice";

export enum TxType {
    TX_NONE = 0,
    TX_COMMAND = 1,
    TX_JSON = 2,
    TX_CONTRACT = 3,
}

export type TransactionEvent = {
    contract: string;
    name: string;
    entries: string[];
}

export type TxOutput = {
    error?: string;
    stack?: string;
    logs?: string[];
    output: string;
    fee: string;
    ctx: string;
    get: string[][];
    set: string[][];
    events: TransactionEvent[];
}

export class Tx implements ChainXSTransaction {
    version: string;
    chain: string;
    validator: string[];
    from: string[];
    debit: string[];
    to: string[];
    amount: string[];
    type: number;
    data: string[];
    output: TxOutput;
    created: number;

    hash: string;
    sign: string[];
    validatorSign: string[];

    constructor(tx?: Partial<Tx>) {
        this.version = tx?.version ?? '';
        this.chain = tx?.chain ?? 'mainnet';
        this.validator = tx?.validator ?? [];
        this.from = tx?.from ?? [];
        this.debit = tx?.debit ?? [];
        this.to = tx?.to ?? [];
        this.amount = tx?.amount ?? [];
        this.type = tx?.type ?? TxType.TX_NONE;
        this.data = tx?.data ?? [];
        this.output = {
            output: '',
            fee: '0',
            ctx: '0000000000000000000000000000000000000000000000000000000000000000',
            get: [],
            set: [],
            events: [],
        };
        if (tx?.output) {
            if(tx.output.error) {
                this.output.error = tx.output.error
            }
            if(tx.output.stack) {
                this.output.stack = tx.output.stack
            }
            if(tx.output.logs) {
                this.output.logs = tx.output.logs
            }
            this.output.output = tx.output.output;
            this.output.fee = tx.output.fee;
            this.output.ctx = tx.output.ctx;
            for (let i = 0; i < tx.output.events.length; i++) {
                const event = tx.output.events[i];
                const eventDTO: TransactionEvent = {
                    contract: event.contract,
                    name: event.name,
                    entries: [],
                }
                for (let j = 0; j < event.entries.length; j++) {
                    const entry = event.entries[j];
                    eventDTO.entries.push(entry);
                }
                this.output.events.push(eventDTO);
            }
        }
        this.created = tx?.created ?? 0;
        this.hash = tx?.hash ?? '';
        this.validatorSign = tx?.validatorSign ?? [];
        this.sign = tx?.sign ?? [];
    }

    toHash(): string {
        let bytes = '';
        bytes += Buffer.from(this.version, 'utf-8').toString('hex');
        bytes += Buffer.from(this.chain, 'utf-8').toString('hex');
        this.validator.forEach(addr => {
            bytes += Buffer.from(addr, 'utf-8').toString('hex');
        })
        this.from.forEach(from => {
            bytes += Buffer.from(from, 'utf-8').toString('hex');
        })
        this.debit.forEach(amount => {
            bytes += ChainXSHelper.Base64AmountToHex32(amount)
        })
        this.to.forEach(to => {
            bytes += Buffer.from(to, 'utf-8').toString('hex');
        })
        this.amount.forEach(amount => {
            bytes += ChainXSHelper.Base64AmountToHex32(amount)
        })
        bytes += ChainXSHelper.numberToHex(this.type);
        bytes += ChainXSHelper.numberToHex(this.created);
        this.data.forEach(dt => {
            bytes += ChainXSHelper.Base64StringToHexString(dt)
        })
        bytes += Buffer.from(this.output.output, 'utf-8').toString('hex');

        bytes += ChainXSHelper.Base64AmountToHex32(this.output.fee)

        bytes += ChainXSHelper.Base64StringToHexString(this.output.ctx)
        this.output.get.forEach(get => {
            get.forEach(key => {
                bytes += Buffer.from(key, 'utf-8').toString('hex');
            })
        })
        this.output.set.forEach(set => {
            set.forEach(key => {
                bytes += Buffer.from(key, 'utf-8').toString('hex');
            })
        })
        this.output.events.forEach(event => {
            bytes += Buffer.from(event.contract, 'utf-8').toString('hex');
            bytes += Buffer.from(event.name, 'utf-8').toString('hex');
            event.entries.forEach(entry => {
                bytes += Buffer.from(entry, 'utf-8').toString('hex');
            })
        })
        bytes = ChainXSHelper.makeHash(bytes);
        return ChainXSHelper.HexStringToBase64String(bytes);
    }

    isValid(): void {
        if (this.version.length === 0) throw new Error('invalid version ' + this.version);
        if (this.chain.length === 0) throw new Error('invalid transaction chain cant be empty');
        if (!ChainXSHelper.isValidAlfaNum(this.chain)) throw new Error('invalid chain');
        if (this.validator) {
            this.validator.forEach(addr => {
                if (!ChainXSHelper.isValidAddress(addr)) throw new Error('invalid transaction validator address ' + addr);
            });
        }
        if (!ChainXSHelper.isStringArray(this.from)) throw new Error('invalid array');
        if (this.from.length === 0) throw new Error('invalid transaction sender cant be empty');
        if (this.from.length > 100) throw new Error('maximum number of senders is 100 signatures');
        this.from.forEach(from => {
            if (!ChainXSHelper.isValidAddress(from)) throw new Error('invalid transaction sender address ' + from);
        })
        if (!ChainXSHelper.isStringArray(this.debit)) throw new Error('invalid array');
        if (this.debit.length === 0) throw new Error('invalid transaction debit cant be empty');
        if (this.debit.length !== this.from.length) throw new Error('from field must be the same length as amount');
        this.debit.forEach(amount => {
            if (!ChainXSHelper.isValidBase64(amount)) throw new Error('invalid transaction amount ' + amount);
        })
        if (!ChainXSHelper.isStringArray(this.to)) throw new Error('invalid array');
        if (this.to.length === 0) throw new Error('invalid transaction recipient cant be empty');
        if (this.to.length > 100) throw new Error('maximum number of recipient is 100');
        this.to.forEach((to, i) => {
            if (!ChainXSHelper.isValidAddress(to)) throw new Error('invalid transaction recipient address ' + to);
        })
        if (!ChainXSHelper.isStringArray(this.amount)) throw new Error('invalid array');
        if (this.amount.length === 0) throw new Error('invalid transaction amount cant be empty');
        if (this.amount.length !== this.to.length) throw new Error('to field must be the same length as amount');
        this.amount.forEach(amount => {
            if (!ChainXSHelper.isValidBase64(amount)) throw new Error('invalid transaction amount ' + amount);
        })
        if (!Object.values(TxType).includes(this.type)) throw new Error('invalid type ' + this.type);
        if (ChainXSHelper.jsonToString(this.data).length > 1048576) throw new Error('data too large');
        if (!ChainXSHelper.isValidDate(this.created)) throw new Error('invalid created date');

        if (!this.output) throw new Error('invalid validator output');
        if (this.output.error !== undefined) throw new Error('transaction output has error');
        if (this.output.stack !== undefined) throw new Error('transaction output has stack');
        if(this.output.logs !== undefined) {
            this.output.logs.forEach(log => {
                if (typeof log !== 'string') throw new Error('logs');
            })
        }
        if (this.output.output.length > 1048576) throw new Error('output too large');
        if (!ChainXSHelper.isValidBase64(this.output.fee)) throw new Error('invalid fee');
        if (!ChainXSHelper.isValidBase64(this.output.ctx)) throw new Error('invalid ctx');
        this.output.get.forEach(([key, value]) => {
            if (key == undefined) throw new Error('invalid get ' + key);
            if (!ChainXSHelper.isValidAlfaNumSlash(key)) throw new Error('invalid get ' + key);
            if (value == undefined) throw new Error('invalid get ' + key);
        })
        this.output.set.forEach(([key, value]) => {
            if (key == undefined) throw new Error('invalid set ' + key);
            if (!ChainXSHelper.isValidAlfaNumSlash(key)) throw new Error('invalid set ' + key);
            if (value == undefined) throw new Error('invalid set ' + key);
        })
        this.output.events.forEach(event => {
            if (!ChainXSHelper.isValidAddress(event.contract)) throw new Error('invalid event.contractAddress');
            if (!ChainXSHelper.isValidAlfaNum(event.name)) throw new Error('invalid event.eventName');
            event.entries.forEach(entry => {
                if (!ChainXSHelper.isValidBase64(entry)) throw new Error('invalid event.entries');
            })
        })
        if (ChainXSHelper.jsonToString(this.output).length > 1048576) throw new Error('invalid validator output');

        if (!ChainXSHelper.isStringArray(this.validator)) throw new Error('invalid array validator');
        if (!ChainXSHelper.isStringArray(this.validatorSign)) throw new Error('invalid array validatorSign');
        if (!ChainXSHelper.isStringArray(this.sign)) throw new Error('invalid array');
        if (!ChainXSHelper.isValidBase64(this.hash)) throw new Error('invalid transaction hash ' + this.hash);
        if (this.hash !== this.toHash()) throw new Error('corrupt transaction');

        if (this.validator.length !== this.validatorSign.length) throw new Error('invalid validator signature');
        for (let i = 0; i < this.validatorSign.length; i++) {
            const sign = this.validatorSign[i];
            const addr = this.validator[i];
            if (!ChainXSHelper.isValidSign(sign, addr, this.hash)) throw new Error('invalid validator signature');
        }
        if (this.sign.length === 0) throw new Error('transaction was not signed');
        if (this.sign.length !== this.from.length) throw new Error('invalid signature');
        for (let i = 0; i < this.sign.length; i++) {
            const sign = this.sign[i];
            const fromAddress = this.from[i];
            if (!ChainXSHelper.isValidSign(sign, fromAddress, this.hash)) throw new Error('invalid signature');
        }
    }
}

export type TxSyncOutput = {
    tx: Tx,
    slice: string
}

export type SimulateTx = {
    chain: string;
    from: string[] | string;
    to: string[] | string;
    amount: string[] | string;
    foreignKeys?: string[];
    type: number;
    data: any;
}

export type SimulateContract = {
    code?: string;
    method?: string;
    inputs?: string[];
    from: string;
    contractAddress?: string;
    amount: number;
    env: any;
}

export type OutputSimulateContract = {
    error?: string;
    stack?: string;
    output: any;
    env: any;
}

export type PublishedTx = {
    version: string;
    validator?: string[];
    from: string[];
    to: string[];
    amount: string[];
    fee: string;
    type: string;
    foreignKeys?: string[];
    data: any;
    created: number;
    hash: string;
    validatorSign?: string[];
    sign: string[];

    status: string;
    output: TxOutput;
}

export type TxBlockchainInfo = {
    tx: PublishedTx;
    slice?: Slice;
    block?: Block;
}