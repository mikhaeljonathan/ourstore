import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest, deleteRequest, updateRequest, postRequest } from "../../utilities/axiosHelper";
import Cookies from "js-cookie";

const initialState = {
    loading: false,
    theme: [],
    error: '',
}

export const updateTheme = (data) => async () => {
    try {
        const jwt = Cookies.get('jwt');
        const config = {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        };
        const response = await updateRequest(`api/v1/themes`, data, config);
        return response.status
    } catch (error) {
        console.log("error update")
    }
};

// Generated pending, fulfilled, and rejected action types
export const fetchTheme = createAsyncThunk('fetchTheme', async () => {
    try {
        const jwt = Cookies.get('jwt');
        const config = {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        };
        const response = await getRequest(`api/v1/themes`, config)
        return response.data
    } catch (error) {
        console.log(error)
    }
})

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchTheme.pending, state => {
            state.loading = true
        })
        builder.addCase(fetchTheme.fulfilled, (state, action) => {
            state.loading = false
            state.theme = action.payload
            state.error = ''
        })
        builder.addCase(fetchTheme.rejected, (state, action) => {
            state.loading = false
            state.theme = []
            state.error = action.error.message
        })
    }
})

export default themeSlice.reducer;