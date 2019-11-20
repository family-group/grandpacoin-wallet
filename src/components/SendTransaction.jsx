import React from 'react';
import Layout from './Layout';
import TextInput from './TextInput';
import './css/SendTransaction.css';
import Button from './Button';
import LogAreaOutput from './LogAreaOutput';

const styles = {
    input: {
        width: '100%',
        marginTop: '15px'
    },
    logAreaOutput: {
        minHeight: '100px',
        marginTop: '15px'
    },
    button: {
        width: '150px',
        marginTop: '15px',
    }
}

class SendTransaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            senderAddress: '',
            recipientAddress: '',
            value: 0,
            urlNode: ''
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        const { name, value } = event.target;

        this.setState({
            [name]: value
        })
    }

    onSignTransaction() {
        console.log('Sign Transaction');
    }

    onSendTransaction() {
        console.log('Send Transaction');
    }

    render() {
        const {
            senderAddress,
            recipientAddress,
            value,
            urlNode
        } = this.state;

        return (
            <Layout>
                <div className="send-transaction-container">
                    <h3 className="component-title">Send Transaction</h3>
                    <div className="send-transaction-inputs">
                        <TextInput
                            name="senderAddress"
                            value={senderAddress}
                            onChange={this.onChange}
                            placeholder="Sender"
                            style={styles.input}
                        />
                        <TextInput
                            name="recipientAddress"
                            value={recipientAddress}
                            onChange={this.onChange}
                            placeholder="Recipient"
                            style={styles.input}
                        />
                        <TextInput
                            name="value"
                            value={value}
                            onChange={this.onChange}
                            placeholder="Value"
                            style={styles.input}
                        />
                        <Button
                            onClick={this.onSignTransaction}
                            style={styles.button}
                        >SIGN TRANSACTION</Button>

                        <LogAreaOutput
                            value=""
                            style={styles.logAreaOutput}
                        />
                        <TextInput
                            name="urlNode"
                            value={urlNode}
                            onChange={this.onChange}
                            placeholder="Blockchain Node"
                            style={styles.input}
                        />
                        <Button
                            onClick={this.onSendTransaction}
                            style={styles.button}
                        >SEND TRANSACTION</Button>
                        <LogAreaOutput
                            value=""
                            style={styles.logAreaOutput}
                        />

                    </div>
                </div>
            </Layout>
        );
    }
}

export default SendTransaction;