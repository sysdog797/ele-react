import React, { Component } from 'react';
import { Provider } from 'react-redux';
import App from './App';
import app from './store';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

const loggerMiddleware = createLogger()

// store
const middlewares = [thunkMiddleware, loggerMiddleware];

const store = createStore(
    app,
    applyMiddleware(
      ...middlewares
    )
)

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}