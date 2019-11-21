import utils from '../utils/functions';
import Ajax from '../utils/xhr';

class Transaction {
    constructor(sender, to, value, fee, data, senderPubKey) {
        this.from = sender;
        this.to = to;
        this.value = value;
        this.fee = fee;
        this.dateCreated = new Date().toISOString();
        this.data = data;
        this.senderPubKey = senderPubKey;
    }

    sign(privateKey) {
        this.senderSignature = utils.signTransaction(this, privateKey);
    }

    verify() {
        return utils.verifySignature(this.transactionDataHash, this.senderPubKey, this.senderSignature);
    }

    send(providerUrl) {
        const ajax = new Ajax(providerUrl + '/transactions/send', {
            method: 'post',
            body: this,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return {
            promise: ajax.result(),
            abort: ajax.abort
        }
    }
}

export default Transaction;