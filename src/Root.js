import React, { Component } from 'react'
import { Provider } from 'react-redux'
import App from './App'

import { createStore, applyMiddleware } from 'redux';

import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Object } from 'core-js';
const loggerMiddleware = createLogger()

// reducer
function myReducer(
    state = { 
      datas: '',
      loading: false,
      recieved: false,
      selectFoods: [],
      selectedFood: '',
      totalCount: 0,
      totalPrice: 0,
      payDesc: '',
      selectType: 2,
      onlyContent: false
    },
    action
  ) {
    switch (action.type) {
      // init
        case 'begin':
            return Object.assign({}, state, {
              loading: true
            })
        case 'finish':
            return Object.assign({}, state, {
              loading: false,
              recieved: true,
              datas: action.datas
            })
        // good component
        case 'selectFood':
            return Object.assign({}, state, {
                selectedFood: action.food
            })
        case 'hideCard':
            return Object.assign({}, state, {
                selectedFood: '',
                onlyContent: false,
                selectType: 2
            })
        case 'clearShopcart':
            return Object.assign({}, state, {
                selectFoods: [],
                totalCount: 0,
                totalPrice: 0,
                payDesc: ''
            })
        case 'handleFoods':
            return Object.assign({}, state, {
                selectFoods: action.selectFoods,
                totalCount: action.totalCount,
                totalPrice: action.totalPrice,
                payDesc: action.payDesc
            })
        // shopcart
        case 'calculateTotal':
            return Object.assign({}, state, {
                totalPrice: action.totalPrice,
                payDesc: action.payDesc,
                totalCount: action.totalCount
            })
        // ratings
        case 'selectRating':
            return Object.assign({}, state, {
                selectType: action.selectType
            })
        case 'toggleContent':
            return Object.assign({}, state, {
                onlyContent: action.onlyContent
            })
        case 'resetRatings':
            return Object.assign({}, state, {
                onlyContent: false,
                selectType: 2
            })
        default:
            return state;
    }
  }

// store
const store = createStore(
    myReducer,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
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