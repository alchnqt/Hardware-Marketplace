import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./messageSlice";

import AuthService, { LoginDTO, RegisterDTO } from "../services/userService";

const user = JSON.parse(localStorage.getItem("user") as any);

export const register = createAsyncThunk(
    "auth/register",
    async (data: RegisterDTO, thunkAPI) => {
        try {
            const response = await AuthService.register(data);
            thunkAPI.dispatch(setMessage(response.data.message));
            return response.data;
        } catch (error: any) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(undefined);
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async (data: LoginDTO, thunkAPI) => {
        try {
            const dataResp = await AuthService.login(data);
            return { user: dataResp };
        } catch (error: any) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(undefined);
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async () => {
    await AuthService.logout();
});

const initialState = user
    ? { isLoggedIn: true, user }
    : { isLoggedIn: false, user: null };

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [register.fulfilled as any]: (state: { isLoggedIn: boolean; }, action: any) => {
            state.isLoggedIn = false;
        },
        [register.rejected as any]: (state, action) => {
            state.isLoggedIn = false;
        },
        [login.fulfilled as any]: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload.user;
        },
        [login.rejected as any]: (state, action) => {
            state.isLoggedIn = false;
            state.user = null;
        },
        [logout.fulfilled as any]: (state, action) => {
            state.isLoggedIn = false;
            state.user = null;
        },
    },
});

const { reducer } = authSlice;
export default reducer;