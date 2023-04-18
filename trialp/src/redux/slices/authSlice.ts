import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./messageSlice";
import jwt_decode from "jwt-decode";
import AuthService, { LoginDTO, RegisterDTO } from "../services/userService";


export interface AxiosRequestResult {
    data: any,
    status: number,
    statusText: string,
    message: any
}

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
    async (data: LoginDTO) => {
        const resp = await AuthService.login(data);
        if (resp.access_token !== undefined) {
            var decoded = jwt_decode(resp.access_token);
            localStorage.setItem("user", JSON.stringify(decoded));
            return;
        }
        return resp;
    }
);

export const logout = createAsyncThunk("auth/logout", async () => {
    await AuthService.logout();
});

export const refreshToken = async () => {
    const resp = await AuthService.refreshToken();
    if (!resp.success) {
        return { user: null, message: resp.result };
    }
    var decoded = jwt_decode(resp.result);
    return { user: decoded, message: resp.result };
};

const initialState =
    user ?
        {
            isLoggedIn: true,
            user,
            accessToken: '',
            message: ''
        } :
        {
            isLoggedIn: false,
            user: null,
            accessToken: '',
            message: ''
        };

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(register.fulfilled, (state: { isLoggedIn: boolean; }, action) => {
                state.isLoggedIn = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoggedIn = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.accessToken = action.payload?.access_token || ''
                state.message = action.payload?.message || ''
                if(state.accessToken === ''){
                    state.isLoggedIn = false;
                }
                else{
                    state.isLoggedIn = true;
                }
                state.user = JSON.parse(localStorage.getItem('user') || 'null');
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoggedIn = false;
                state.user = null;
                state.accessToken = ''
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = false;
                state.user = null;
                state.accessToken = ''
            })
    },
});

const { reducer } = authSlice;
export default reducer;

export const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
export const NAME_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
export const PHONE_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone";
export const EMAIL_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
export const ID_CLAIM = "id";