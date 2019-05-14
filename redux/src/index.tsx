import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {createStore} from "redux";
import {MSReducer} from "./reducers";
import {initialMSStore} from "./redux";
import {createManuscript} from "./actions";
import { Provider } from 'react-redux'

const store = createStore(MSReducer, initialMSStore)
store.dispatch(createManuscript({title: "This is just a test manuscript", abstract: "Wow great content"}))

ReactDOM.render(
    <Provider store={store}>
    <App />
    </Provider>,
    document.getElementById('root')
);
