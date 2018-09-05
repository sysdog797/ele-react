import actionTypes from './actionTypes';

export const clearShopcart = () => {
    return {
        type: actionTypes.CLEAR_SHOPCART
    }
}

export const handleFoods = (sf, total, payDesc, totalCount) => {
    return {
        type: actionTypes.HANDLE_FOODS,
        selectFoods: sf,
        totalPrice: total,
        payDesc: payDesc,
        totalCount: totalCount
    }
}