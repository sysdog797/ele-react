import actionTypes from './actionTypes';
import * as services from './services';

export const hideCard = () => {
    return {
        type: actionTypes.HIDE_CARD
    }
}

export const selectFood = (food) => {
    return {
        type: actionTypes.SELECT_FOOD,
        food: food
    }
}

export const resetRatings = () => {
    return {
        type: actionTypes.RESET_RATINGS
    }
}

export const toggleContent = (status) => {
    return {
        type: actionTypes.TOGGLE_CONTENT,
        status: status
    }
}

export const selectRating = (selectType) => {
    return {
        type: actionTypes.SELECT_RATING,
        selectType: selectType
    }
}

export const fetchData = () => {
    return async(dispatch) => {
        const res = await services.fetchData();
        dispatch({
            type: actionTypes.FETCH_DATA,
            datas: res
        })
    }
}