//@TS -nocheck
import { createSlice } from '@reduxjs/toolkit'
import { registerUser } from '../thunks/userActions';

const initialState = {
    loading: false,
    currentUser: null, // for user object
    userToken: null, // for storing the JWT
    role: "",
    error: null,
    success: false, // for monitoring the registration process.
}

//const userSlice = createSlice({
//    name: 'user',
//    initialState,
//    reducers: {},
//    extraReducers: {},
//});


export const userSlice = createSlice({
    initialState: initialState,
    name: 'userSlice',
    reducers: {
        [registerUser.pending as any]: (state) => {
            state.loading = true
            state.error = null
        },
        [registerUser.fulfilled as any]: (state, { payload }) => {
            state.loading = false
            state.success = true // registration successful
        },
        [registerUser.rejected as any]: (state, { payload }) => {
            state.loading = false
            state.error = payload
        },
    },
});

export const {} = userSlice.actions;

export default userSlice.reducer;