import { createReducer } from '../reduxHelper';
import actionTypes from './actionTypes';

const initState = {
    selectedFood: '',
    onlyContent: false,
    selectType: 2,
    datas: ''
};

export default createReducer(initState, {
    [actionTypes.HIDE_CARD](state, action) {
        return {
            ...state,
            selectedFood: '',
            onlyContent: false,
            selectType: 2
        }
    },
    [actionTypes.SELECT_FOOD](state, action) {
        return {
            ...state,
            selectedFood: action.food
        }
    },
    [actionTypes.RESET_RATINGS](state, action) {
        return {
            ...state,
            onlyContent: false,
            selectType: 2
        }
    },
    [actionTypes.TOGGLE_CONTENT](state, action) {
        return {
            ...state,
            onlyContent: !action.status
        }
    },
    [actionTypes.SELECT_RATING](state, action) {
        return {
            ...state,
            selectType: action.selectType
        }
    },
    [actionTypes.FETCH_DATA](state, action) {
        return {
            ...state,
            datas: action.datas
        }
    }
})