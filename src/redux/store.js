import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { createPromise } from 'redux-promise-middleware';

const composeEnhacers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const configureStore = (rootReducer, options) => {
    const { initialState = {} } = options;
    const middlewares = [
        thunk,
        createPromise({
            promiseTypeSuffixes: ['START', 'SUCCESS', 'ERROR']
        }),
    ];

    return createStore(rootReducer, initialState, composeEnhacers(
        applyMiddleware(...middlewares)
    ));
}