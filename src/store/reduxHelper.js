export const createActionType = (actionTypes, prefix) => {
    const result = {};
    (actionTypes || []).forEach(type => {
        result[type] = prefix + type;
    });
    return result;
};

export const createReducer = (initState, actionHandlerMap) => {
    return (state = initState, action) => {
        let handler = null;
        if(action.type) {
            handler = actionHandlerMap[action.type];
        }
        if(handler) {
            return handler(state, action);
        }
        return state;
    }
};