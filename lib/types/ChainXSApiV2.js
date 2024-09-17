"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainXSApiV2 = void 0;
const axios_1 = __importDefault(require("axios"));
class ChainXSApiV2 {
    constructor(debug) {
        this.debug = debug !== undefined ? debug : false;
    }
    get(url_1, token_1) {
        return __awaiter(this, arguments, void 0, function* (url, token, parameters = {}) {
            let response = { data: {} };
            try {
                const res = yield axios_1.default.get(url, {
                    params: parameters,
                    headers: Object.assign({ 'Content-Type': 'application/json' }, (token ? { 'Authorization': `Node ${token}` } : {})),
                    timeout: 30000,
                });
                response.data = res.data;
                if (this.debug) {
                    console.log(`response`, response.data);
                }
            }
            catch (err) {
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
        });
    }
    post(url_1, token_1) {
        return __awaiter(this, arguments, void 0, function* (url, token, parameters = {}) {
            let response = { data: {} };
            try {
                const res = yield axios_1.default.post(url, parameters, {
                    headers: Object.assign({ 'Content-Type': 'application/json' }, (token ? { 'Authorization': `Node ${token}` } : {})),
                    timeout: 30000,
                });
                response.data = res.data;
                if (this.debug) {
                    console.log(`response`, response.data);
                }
            }
            catch (err) {
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
        });
    }
    publishNewBlock(node, block) {
        return this.post(`${node.host}/api/v2/blocks`, node.token, block);
    }
    getBlocks(node, chain, parameters = {}) {
        return this.get(`${node.host}/api/v2/blocks/last/${chain}`, node.token, parameters);
    }
    countBlocks(node, chain, parameters = {}) {
        return this.get(`${node.host}/api/v2/blocks/count/${chain}`, node.token, parameters);
    }
    getBlockByHash(node, hash) {
        return this.get(`${node.host}/api/v2/blocks/hash/${hash}`, node.token);
    }
    getBlockByHeight(node, chain, height) {
        return this.get(`${node.host}/api/v2/blocks/height/${chain}/${height}`, node.token);
    }
    getBlockPackByHeight(node, chain, height) {
        return this.get(`${node.host}/api/v2/blocks/pack/${chain}/${height}`, node.token);
    }
    getSlicesFromBlock(node, blockHash) {
        return this.get(`${node.host}/api/v2/blocks/slices/${blockHash}`, node.token);
    }
    publishNewSlice(node, slice) {
        return this.post(`${node.host}/api/v2/slices`, node.token, slice);
    }
    getSlices(node, chain, parameters) {
        return this.get(`${node.host}/api/v2/slices/last/${chain}`, node.token, parameters);
    }
    countSlices(node, chain, parameters = {}) {
        return this.get(`${node.host}/api/v2/slices/count/${chain}`, node.token, parameters);
    }
    getSliceByHash(node, hash) {
        return this.get(`${node.host}/api/v2/slices/hash/${hash}`, node.token);
    }
    getTransactionsFromSlice(node, sliceHash) {
        return this.get(`${node.host}/api/v2/slices/transactions/${sliceHash}`, node.token);
    }
    publishNewTransaction(node, tx) {
        return this.post(`${node.host}/api/v2/transactions`, node.token, tx);
    }
    validadeTransaction(node, tx) {
        return this.post(`${node.host}/api/v2/transactions/validate`, node.token, tx);
    }
    getTxs(node, chain, parameters) {
        return this.get(`${node.host}/api/v2/transactions/last/${chain}`, node.token, parameters);
    }
    countTxs(node, parameters) {
        return this.get(`${node.host}/api/v2/transactions/count`, node.token, parameters);
    }
    getTransactionByHash(node, hash) {
        return this.get(`${node.host}/api/v2/transactions/hash/${hash}`, node.token);
    }
    getFeeTransaction(node, simulateTx) {
        return this.post(`${node.host}/api/v2/transactions/fee`, node.token, simulateTx);
    }
    getContractByAddress(node, chain, address) {
        return this.get(`${node.host}/api/v2/contracts/abi/${chain}/${address}`, node.token);
    }
    getContractEventByAddress(node, chain, address, event, byKey) {
        return this.get(`${node.host}/api/v2/contracts/events/${chain}/${address}/${event}`, node.token, byKey);
    }
    trySimulate(node, simulateTx) {
        return this.post(`${node.host}/api/v2/contracts/simulate`, node.token, simulateTx);
    }
    getWalletInfo(node, address, chain) {
        return this.get(`${node.host}/api/v2/wallets/${address}/${chain}`, node.token);
    }
    tryToken(node) {
        return this.get(`${node.host}/api/v2/nodes/try-token`, node.token);
    }
    getInfo(host) {
        return this.get(`${host}/api/v2/nodes/info`, undefined);
    }
    tryHandshake(host, myNode) {
        return this.post(`${host}/api/v2/nodes/handshake`, undefined, myNode !== null && myNode !== void 0 ? myNode : {});
    }
}
exports.ChainXSApiV2 = ChainXSApiV2;
