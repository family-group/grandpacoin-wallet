import utils from '../utils/functions';
import Xhr from '../utils/xhr';
import { sha256 } from '../utils/hashes';

class Transaction {
    constructor({ from, to, value, data, senderPubKey, privKey }) {
        this.from = from.replace('0x', '');
        this.to = to.replace('0x', '');
        this.value = value;
        this.fee = "10";
        this.dateCreated = new Date().toISOString();
        this.data = data ? data.trim() : undefined;
        this.senderPubKey = senderPubKey.replace('0x', '');
        this.privKey = privKey.replace('0x', '');
        this.senderSignature = Transaction.sign(this);
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
    //0xa6ef9089840a55ae5934b49e681ca6a60a7ebaec
    //0x607168b61015cfe766a3a6716180f9b60e909f35
    async send(providerUrl) {
        const { from, to, value, data, fee, senderPubKey, senderSignature, dateCreated, transactionDataHash } = this;
        try {
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

            return {
                promise: xhr.result(),
                result: await xhr.result(),
                abort: xhr.abort
            }
        } catch (err) {
            console.log(err)
        }
    }
}

export default Transaction;