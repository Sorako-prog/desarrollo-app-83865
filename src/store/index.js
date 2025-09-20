import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import shopReducer from './slices/shopSlices'
import cartReducer from './slices/cartSlices'
import {shopApi} from '../services/shopApi'
import userReducer from './slices/userSlices'
import {authApi} from '../services/authApi'
import {profileApi} from '../services/profileApi'
import {ordersApi} from '../services/ordersApi'


export const store = configureStore({
    reducer: {
        shop: shopReducer,
        cart: cartReducer,
        user: userReducer,
        [shopApi.reducerPath]: shopApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        [ordersApi.reducerPath]: ordersApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(shopApi.middleware, authApi.middleware, profileApi.middleware, ordersApi.middleware)
})

setupListeners(store.dispatch)

export default store