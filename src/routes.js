import Home from './components/Home';
import CreateWallet from './components/CreateWallet';
import AccountBalance from './components/AccountBalance';
import SendTransaction from './components/SendTransaction';
import NotFound404 from './components/NotFound404';
import OpenWallet from './components/OpenWallet';

const routes = [
    {
        path: '/',
        component: Home,
        exact: true,
    },
    {
        path: '/open-wallet',
        component: OpenWallet,
        exact: true,
    },
    {
        path: '/create-wallet',
        component: CreateWallet,
        exact: true,
    },
    {
        path: '/account-balance',
        component: AccountBalance,
        exact: true,
    },
    {
        path: '/send-transaction',
        component: SendTransaction,
        exact: true,
    },
    {
        path: '*',
        component: NotFound404,
    },

];

export default routes;