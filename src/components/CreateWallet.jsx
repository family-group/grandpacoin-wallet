import React from 'react';
import Layout from './Layout';
import Button from './Button';
import LogAreaOutput from './LogAreaOutput';

class CreateWallet extends React.Component {

    onClick() {
        console.log('Create New Wallet');
    }


    render() {
        return (
            <Layout>
                <div className="create-wallet-container">
                    <h3 className="component-title">Create a New Wallet</h3>
                    <p className="component-description">Generate a new wallet: random private key -> public key -> address</p>
                    <div>
                        <Button onClick={this.onClick}>GENERATE NOW</Button>
                        <LogAreaOutput value={''} style={{ minHeight: '100px' }} />
                    </div>
                </div>
            </Layout>
        )
    }
}

export default CreateWallet;