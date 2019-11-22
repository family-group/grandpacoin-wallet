import React from 'react';
import Layout from './Layout';

class Home extends React.Component {
    render() {
        return (
            <Layout>
                <p className="welcome-text">WELCOME TO GRANDPACOIN WALLET</p>
                <div className="welcome-text-conteiner">
                    <p className="home-text">Open your wallet or create a new one to fully enjoy your grandpa coins!</p>
                    <p className="home-option-text">Please select an option in the header menu.</p>
                </div>
            </Layout>
        )
    }
}

export default Home;