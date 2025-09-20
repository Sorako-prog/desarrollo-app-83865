import { createSlice } from '@reduxjs/toolkit'


const userSlice = createSlice({
    name: 'user',
    initialState: {
        email: "",
        localId: "",
        image: "",
    },
    reducers: {
        setUserEmail: (state, action) => {
            state.email = action.payload
        },
        setUserLocalId: (state, action) => {
            state.localId = action.payload
        },
        setUserImage: (state, action) => {
            state.image = action.payload
        }
    }
})

export const { setUserEmail, setUserLocalId, setUserImage } = userSlice.actions
export default userSlice.reducer