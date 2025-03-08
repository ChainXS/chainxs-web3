"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tx = exports.TxType = void 0;
const ChainXSHelper_1 = require("../utils/ChainXSHelper");
var TxType;
(function (TxType) {
    TxType[TxType["TX_NONE"] = 0] = "TX_NONE";
    TxType[TxType["TX_COMMAND"] = 1] = "TX_COMMAND";
    TxType[TxType["TX_JSON"] = 2] = "TX_JSON";
    TxType[TxType["TX_CONTRACT"] = 3] = "TX_CONTRACT";
})(TxType || (exports.TxType = TxType = {}));
class Tx {
    constructor(tx) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        this.version = (_a = tx === null || tx === void 0 ? void 0 : tx.version) !== null && _a !== void 0 ? _a : '';
        this.chain = (_b = tx === null || tx === void 0 ? void 0 : tx.chain) !== null && _b !== void 0 ? _b : 'mainnet';
        this.validator = (_c = tx === null || tx === void 0 ? void 0 : tx.validator) !== null && _c !== void 0 ? _c : [];
        this.from = (_d = tx === null || tx === void 0 ? void 0 : tx.from) !== null && _d !== void 0 ? _d : [];
        this.debit = (_e = tx === null || tx === void 0 ? void 0 : tx.debit) !== null && _e !== void 0 ? _e : [];
        this.to = (_f = tx === null || tx === void 0 ? void 0 : tx.to) !== null && _f !== void 0 ? _f : [];
        this.amount = (_g = tx === null || tx === void 0 ? void 0 : tx.amount) !== null && _g !== void 0 ? _g : [];
        this.type = (_h = tx === null || tx === void 0 ? void 0 : tx.type) !== null && _h !== void 0 ? _h : TxType.TX_NONE;
        this.data = (_j = tx === null || tx === void 0 ? void 0 : tx.data) !== null && _j !== void 0 ? _j : [];
        this.output = {
            output: '',
            fee: '0',
            ctx: '0000000000000000000000000000000000000000000000000000000000000000',
            get: [],
            set: [],
            events: [],
        };
        if (tx === null || tx === void 0 ? void 0 : tx.output) {
            if (tx.output.error) {
                this.output.error = tx.output.error;
            }
            if (tx.output.stack) {
                this.output.stack = tx.output.stack;
            }
            if (tx.output.logs) {
                this.output.logs = tx.output.logs;
            }
            this.output.output = tx.output.output;
            this.output.fee = tx.output.fee;
            this.output.ctx = tx.output.ctx;
            for (let i = 0; i < tx.output.events.length; i++) {
                const event = tx.output.events[i];
                const eventDTO = {
                    contract: event.contract,
                    name: event.name,
                    entries: [],
                };
                for (let j = 0; j < event.entries.length; j++) {
                    const entry = event.entries[j];
                    eventDTO.entries.push(entry);
                }
                this.output.events.push(eventDTO);
            }
        }
        this.created = (_k = tx === null || tx === void 0 ? void 0 : tx.created) !== null && _k !== void 0 ? _k : 0;
        this.hash = (_l = tx === null || tx === void 0 ? void 0 : tx.hash) !== null && _l !== void 0 ? _l : '';
        this.validatorSign = (_m = tx === null || tx === void 0 ? void 0 : tx.validatorSign) !== null && _m !== void 0 ? _m : [];
        this.sign = (_o = tx === null || tx === void 0 ? void 0 : tx.sign) !== null && _o !== void 0 ? _o : [];
    }
    toHash() {
        let bytes = '';
        bytes += Buffer.from(this.version, 'utf-8').toString('hex');
        bytes += Buffer.from(this.chain, 'utf-8').toString('hex');
        this.validator.forEach(addr => {
            bytes += Buffer.from(addr, 'utf-8').toString('hex');
        });
        this.from.forEach(from => {
            bytes += Buffer.from(from, 'utf-8').toString('hex');
        });
        this.debit.forEach(amount => {
            bytes += ChainXSHelper_1.ChainXSHelper.Base64AmountToHex32(amount);
        });
        this.to.forEach(to => {
            bytes += Buffer.from(to, 'utf-8').toString('hex');
        });
        this.amount.forEach(amount => {
            bytes += ChainXSHelper_1.ChainXSHelper.Base64AmountToHex32(amount);
        });
        bytes += ChainXSHelper_1.ChainXSHelper.numberToHex(this.type);
        bytes += ChainXSHelper_1.ChainXSHelper.numberToHex(this.created);
        this.data.forEach(dt => {
            bytes += ChainXSHelper_1.ChainXSHelper.Base64StringToHexString(dt);
        });
        bytes += Buffer.from(this.output.output, 'utf-8').toString('hex');
        bytes += ChainXSHelper_1.ChainXSHelper.Base64AmountToHex32(this.output.fee);
        bytes += ChainXSHelper_1.ChainXSHelper.Base64StringToHexString(this.output.ctx);
        this.output.get.forEach(get => {
            get.forEach(key => {
                bytes += Buffer.from(key, 'utf-8').toString('hex');
            });
        });
        this.output.set.forEach(set => {
            set.forEach(key => {
                bytes += Buffer.from(key, 'utf-8').toString('hex');
            });
        });
        this.output.events.forEach(event => {
            bytes += Buffer.from(event.contract, 'utf-8').toString('hex');
            bytes += Buffer.from(event.name, 'utf-8').toString('hex');
            event.entries.forEach(entry => {
                bytes += Buffer.from(entry, 'utf-8').toString('hex');
            });
        });
        bytes = ChainXSHelper_1.ChainXSHelper.makeHash(bytes);
        return ChainXSHelper_1.ChainXSHelper.HexStringToBase64String(bytes);
    }
    isValid() {
        if (this.version.length === 0)
            throw new Error('invalid version ' + this.version);
        if (this.chain.length === 0)
            throw new Error('invalid transaction chain cant be empty');
        if (!ChainXSHelper_1.ChainXSHelper.isValidAlfaNum(this.chain))
            throw new Error('invalid chain');
        if (this.validator) {
            this.validator.forEach(addr => {
                if (!ChainXSHelper_1.ChainXSHelper.isValidAddress(addr))
                    throw new Error('invalid transaction validator address ' + addr);
            });
        }
        if (!ChainXSHelper_1.ChainXSHelper.isStringArray(this.from))
            throw new Error('invalid array');
        if (this.from.length === 0)
            throw new Error('invalid transaction sender cant be empty');
        if (this.from.length > 100)
            throw new Error('maximum number of senders is 100 signatures');
        this.from.forEach(from => {
            if (!ChainXSHelper_1.ChainXSHelper.isValidAddress(from))
                throw new Error('invalid transaction sender address ' + from);
        });
        if (!ChainXSHelper_1.ChainXSHelper.isStringArray(this.debit))
            throw new Error('invalid array');
        if (this.debit.length === 0)
            throw new Error('invalid transaction debit cant be empty');
        if (this.debit.length !== this.from.length)
            throw new Error('from field must be the same length as amount');
        this.debit.forEach(amount => {
            if (!ChainXSHelper_1.ChainXSHelper.isValidBase64(amount))
                throw new Error('invalid transaction amount ' + amount);
        });
        if (!ChainXSHelper_1.ChainXSHelper.isStringArray(this.to))
            throw new Error('invalid array');
        if (this.to.length === 0)
            throw new Error('invalid transaction recipient cant be empty');
        if (this.to.length > 100)
            throw new Error('maximum number of recipient is 100');
        this.to.forEach((to, i) => {
            if (!ChainXSHelper_1.ChainXSHelper.isValidAddress(to))
                throw new Error('invalid transaction recipient address ' + to);
        });
        if (!ChainXSHelper_1.ChainXSHelper.isStringArray(this.amount))
            throw new Error('invalid array');
        if (this.amount.length === 0)
            throw new Error('invalid transaction amount cant be empty');
        if (this.amount.length !== this.to.length)
            throw new Error('to field must be the same length as amount');
        this.amount.forEach(amount => {
            if (!ChainXSHelper_1.ChainXSHelper.isValidBase64(amount))
                throw new Error('invalid transaction amount ' + amount);
        });
        if (!Object.values(TxType).includes(this.type))
            throw new Error('invalid type ' + this.type);
        if (ChainXSHelper_1.ChainXSHelper.jsonToString(this.data).length > 1048576)
            throw new Error('data too large');
        if (!ChainXSHelper_1.ChainXSHelper.isValidDate(this.created))
            throw new Error('invalid created date');
        if (!this.output)
            throw new Error('invalid validator output');
        if (this.output.error !== undefined)
            throw new Error('transaction output has error');
        if (this.output.stack !== undefined)
            throw new Error('transaction output has stack');
        if (this.output.logs !== undefined) {
            this.output.logs.forEach(log => {
                if (typeof log !== 'string')
                    throw new Error('logs');
            });
        }
        if (this.output.output.length > 1048576)
            throw new Error('output too large');
        if (!ChainXSHelper_1.ChainXSHelper.isValidBase64(this.output.fee))
            throw new Error('invalid fee');
        if (!ChainXSHelper_1.ChainXSHelper.isValidBase64(this.output.ctx))
            throw new Error('invalid ctx');
        this.output.get.forEach(([key, value]) => {
            if (key == undefined)
                throw new Error('invalid get ' + key);
            if (!ChainXSHelper_1.ChainXSHelper.isValidAlfaNumSlash(key))
                throw new Error('invalid get ' + key);
            if (value == undefined)
                throw new Error('invalid get ' + key);
        });
        this.output.set.forEach(([key, value]) => {
            if (key == undefined)
                throw new Error('invalid set ' + key);
            if (!ChainXSHelper_1.ChainXSHelper.isValidAlfaNumSlash(key))
                throw new Error('invalid set ' + key);
            if (value == undefined)
                throw new Error('invalid set ' + key);
        });
        this.output.events.forEach(event => {
            if (!ChainXSHelper_1.ChainXSHelper.isValidAddress(event.contract))
                throw new Error('invalid event.contractAddress');
            if (!ChainXSHelper_1.ChainXSHelper.isValidAlfaNum(event.name))
                throw new Error('invalid event.eventName');
            event.entries.forEach(entry => {
                if (!ChainXSHelper_1.ChainXSHelper.isValidBase64(entry))
                    throw new Error('invalid event.entries');
            });
        });
        if (ChainXSHelper_1.ChainXSHelper.jsonToString(this.output).length > 1048576)
            throw new Error('invalid validator output');
        if (!ChainXSHelper_1.ChainXSHelper.isStringArray(this.validator))
            throw new Error('invalid array validator');
        if (!ChainXSHelper_1.ChainXSHelper.isStringArray(this.validatorSign))
            throw new Error('invalid array validatorSign');
        if (!ChainXSHelper_1.ChainXSHelper.isStringArray(this.sign))
            throw new Error('invalid array');
        if (!ChainXSHelper_1.ChainXSHelper.isValidBase64(this.hash))
            throw new Error('invalid transaction hash ' + this.hash);
        if (this.hash !== this.toHash())
            throw new Error('corrupt transaction');
        if (this.validator.length !== this.validatorSign.length)
            throw new Error('invalid validator signature');
        for (let i = 0; i < this.validatorSign.length; i++) {
            const sign = this.validatorSign[i];
            const addr = this.validator[i];
            if (!ChainXSHelper_1.ChainXSHelper.isValidSign(sign, addr, this.hash))
                throw new Error('invalid validator signature');
        }
        if (this.sign.length === 0)
            throw new Error('transaction was not signed');
        if (this.sign.length !== this.from.length)
            throw new Error('invalid signature');
        for (let i = 0; i < this.sign.length; i++) {
            const sign = this.sign[i];
            const fromAddress = this.from[i];
            if (!ChainXSHelper_1.ChainXSHelper.isValidSign(sign, fromAddress, this.hash))
                throw new Error('invalid signature');
        }
    }
}
exports.Tx = Tx;
