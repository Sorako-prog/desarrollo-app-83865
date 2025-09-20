import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        user: null,
        updatedAt: new Date().toLocaleString(),
        cartItems: [],
        total: 0,
    },
    reducers: {
        addItemToCart: (state, action) => {
            const { product, quantity } = action.payload
            
            if (product.stock <= 0) {
                return
            }
            
            const finalPrice = product.discount > 0 
                ? Math.round(product.price * (1 - product.discount / 100))
                : product.price
            
            const itemIndex = state.cartItems.findIndex(item => item.id === product.id)
            
            if (itemIndex !== -1) {
                const newQuantity = state.cartItems[itemIndex].quantity + quantity
                if (newQuantity <= product.stock) {
                    state.cartItems[itemIndex].quantity = newQuantity
                    state.total += finalPrice * quantity
                }
            } else {
                if (quantity <= product.stock) {
                    state.cartItems.push({ ...product, quantity, finalPrice })
                    state.total += finalPrice * quantity
                }
            }
        },
        removeItemFromCart: (state, action) => {
            const { product, quantity } = action.payload
            const itemIndex = state.cartItems.findIndex(item => item.id === product.id)
            if (itemIndex !== -1) {
                const item = state.cartItems[itemIndex]
                const priceToUse = item.finalPrice || product.price
                state.cartItems[itemIndex].quantity -= quantity
                if (state.cartItems[itemIndex].quantity <= 0) {
                    state.cartItems.splice(itemIndex, 1)
                }
                state.total -= priceToUse * quantity
            }
        },
        removeItemCompletely: (state, action) => {
            const { product } = action.payload
            const itemIndex = state.cartItems.findIndex(item => item.id === product.id)
            if (itemIndex !== -1) {
                const item = state.cartItems[itemIndex]
                const priceToUse = item.finalPrice || item.price
                state.total -= priceToUse * item.quantity
                state.cartItems.splice(itemIndex, 1)
            }
        },
        clearCart: (state) => {
            state.cartItems = []
            state.total = 0
        },
        getAvailableStock: (state, action) => {
            const { product } = action.payload
            const cartItem = state.cartItems.find(item => item.id === product.id)
            const quantityInCart = cartItem ? cartItem.quantity : 0
            return product.stock - quantityInCart
        }
    }
})

export const { addItemToCart, removeItemFromCart, removeItemCompletely, clearCart } = cartSlice.actions
export default cartSlice.reducer