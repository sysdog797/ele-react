import { createReducer } from '../reduxHelper';
import actionTypes from './actionTypes';

const initState = {
    selectFoods: [],
    totalCount: 0,
    totalPrice: 0,
    payDesc: ''
};

export default createReducer(initState, {
    [actionTypes.CLEAR_SHOPCART](state, action) {
        return {
            ...state,
            selectFoods: [],
            totalCount: 0,
            totalPrice: 0,
            payDesc: ''
        }
    },
    [actionTypes.HANDLE_FOODS](state, action) {
        return {
            ...state,
            selectFoods: action.selectFoods,
            totalPrice: action.totalPrice,
            payDesc: action.payDesc,
            totalCount: action.totalCount
        }
    }
})