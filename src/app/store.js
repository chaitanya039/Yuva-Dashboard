import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import categoryReducer from '../features/categorySlice';
import productReducer from '../features/productSlice';
import orderReducer from '../features/orderSlice';
import orderRequestReducer from '../features/orderRequestSlice';
import expenseReducer from '../features/expenseSlice';
import analyticsReducer from '../features/analyticsSlice';
import reportsReducer from "../features/reportSlice";
import listenerMiddleware from './listenerMiddleware';
import customerReducer from "../features/customerSlice";
import inventoryReducer from "../features/inventorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    products: productReducer,
    orders: orderReducer,
    orderRequests: orderRequestReducer,
    expenses: expenseReducer,
    analytics: analyticsReducer,
    reports: reportsReducer,
    customers: customerReducer,
    inventory: inventoryReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});
