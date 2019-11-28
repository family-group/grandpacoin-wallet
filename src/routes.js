import Home from './components/Home';
import CreateWallet from './components/CreateWallet';
import AccountBalance from './components/AccountBalance';
import SendTransaction from './components/SendTransaction';
import NotFound404 from './components/NotFound404';
import OpenWallet from './components/OpenWallet';
import NewWallet from './components/NewWallet';

export default function routes(logged) {
    if (logged) {
        return [
            {
                path: '/',
                component: Home,
                exact: true,
            },
            {
                path: '/new-wallet',
                component: NewWallet,
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
            }
        ];
    }
    return [
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
            path: '*',
            component: NotFound404,
        }
    ]
}