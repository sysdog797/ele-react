import { combineReducers } from 'redux';

import good from './good/reducers';
import shopcart from './shopcart/reducers';

const app = combineReducers({
    good,
    shopcart
});

export default app;