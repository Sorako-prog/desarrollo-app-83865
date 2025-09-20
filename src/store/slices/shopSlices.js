import { createSlice } from '@reduxjs/toolkit'

import categories from '../../data/categories.json'
import products from '../../data/products.json'

const shopSlice = createSlice({
    name: 'shop',
    initialState: {
        categories,
        products,
        categorySelected: null,
        productSelected: null,
    },
    reducers: {
        setCategorySelected: (state, action) => {
            state.categorySelected = action.payload
        },
        setProductSelected: (state, action) => {
            state.productSelected = action.payload
        }
    }
})

export const { setCategorySelected, setProductSelected } = shopSlice.actions
export default shopSlice.reducer