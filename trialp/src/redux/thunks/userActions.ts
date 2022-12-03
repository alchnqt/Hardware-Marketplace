import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

interface RegisterUser {
    Username: string,
    Email: string,
    Password: string,
    RepeatPassword: string
}

export const registerUser = createAsyncThunk(
    'user/register',
    async function(user: RegisterUser, { rejectWithValue }) {
        try {
            // configure header's Content-Type as JSON
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            // make request to backend
            await axios.post(
                '/api/user/register',
                user,
                config
            )
        } catch (error: any) {
            // return custom error message from API if any
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }

    }
)