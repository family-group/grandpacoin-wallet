import utils from '../utils/functions';
import Xhr from '../utils/xhr';
import { sha256 } from '../utils/hashes';

class Transaction {
    constructor({ from, to, value, fee, data, senderPubKey, privKey }) {
        this.from = from.replace('0x', '');
        this.to = to.replace('0x', '');
        this.value = value;
        this.fee = fee;
        this.dateCreated = new Date().toISOString();
        this.data = data ? data.trim() : undefined;
        this.senderPubKey = senderPubKey.replace('0x', '');
        this.privKey = privKey.replace('0x', '');
        this.senderSignature = [];
        this.transactionDataHash = Transaction.transactionHash(this)
    }

    getTransactionData() {
        const { from, to, value, data, fee, senderPubKey, senderSignature, dateCreated, transactionDataHash } = this;
        return {
            from,
            to,
            value,
            fee,
            dateCreated,
            data,
            senderPubKey,
            transactionDataHash,
            senderSignature
        }
    }
    static transactionHash(transaction) {
        const { from, to, value, fee, data, dateCreated, senderPubKey } = transaction;
        return sha256(JSON.stringify({
            from,
            to,
            value,
            fee,
            dateCreated,
            data: data ? data : undefined,
            senderPubKey,
        }))
    }

    static sign(transaction) {
        const { from, to, value, fee, data, dateCreated, senderPubKey, privKey } = transaction;
        return utils.signTransaction({
            from,
            to,
            value,
            fee,
            dateCreated,
            data: data ? data : undefined,
            senderPubKey
        }, privKey);
    }

    verify() {
        return utils.verifySignature(this.transactionDataHash, this.senderPubKey, this.senderSignature);
    }

    send(providerUrl) {
        const { from, to, value, data, fee, senderPubKey, senderSignature, dateCreated, transactionDataHash } = this;
        return new Promise(async (resolve, reject) => {
            const xhr = new Xhr('/transactions/send', {
                useBaseUrl: providerUrl,
                body: {
                    from,
                    to,
                    value,
                    fee,
                    dateCreated,
                    data,
                    senderPubKey,
                    transactionDataHash,
                    senderSignature
                },
                method: 'POST'
            });
            try {
                return resolve(
                    {
                        promise: xhr.result(),
                        result: await xhr.result(),
                        abort: xhr.abort
                    }
                )
            } catch (error) {
                return reject(error)
            }

        })
    }
}

export default Transaction;