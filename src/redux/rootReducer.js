import {all} from "redux-saga/effects";
import {combineReducers} from "redux";

import * as auth from "../app/modules/Auth/_redux/authRedux";
import { customersSlice } from "../app/modules/ECommerce/_redux/customers/customersSlice";
import { productsSlice } from "../app/modules/ECommerce/_redux/products/productsSlice";
import { remarksSlice } from "../app/modules/ECommerce/_redux/remarks/remarksSlice";
import { specificationsSlice } from "../app/modules/ECommerce/_redux/specifications/specificationsSlice";
import usersReducer from '../app/pages/_redux/Reducers/usersSlice';
import processReducer from '../app/pages/_redux/Reducers/processSlice';
import tokenReducer from '../app/pages/_redux/Reducers/TokenSlice';
import categoryReducer from '../app/pages/_redux/Reducers/categorySlice';
import rolesResuce from '../app/pages/_redux/Reducers/rolesSlice';

export const rootReducer = combineReducers({
  auth: auth.reducer,
  customers: customersSlice.reducer,
  products: productsSlice.reducer,
  remarks: remarksSlice.reducer,
  specifications: specificationsSlice.reducer,
  category : categoryReducer,
  users:usersReducer,
  roles:rolesResuce,
  process:processReducer,
  tokenReducer:tokenReducer
});

export function* rootSaga() {
  yield all([auth.saga()]);
}