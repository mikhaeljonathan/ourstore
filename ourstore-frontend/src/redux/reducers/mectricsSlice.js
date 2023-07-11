import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest, deleteRequest, updateRequest } from "../../utilities/axiosHelper";
import Cookies from "js-cookie";

const initialState = {
    loading: false,
    metrics: [],
    error: '',
}

// Generated pending, fulfilled, and rejected action types
export const fetchMetrics = createAsyncThunk('fetchMetrics', async () => {
    try {
        const jwt = Cookies.get('jwt');
        const config = {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        };
        const response = await getRequest(`api/v1/metrics`, config)
        return response.data
    } catch (error) {
        console.log(error)
    }
})

const metricsSlice = createSlice({
    name: 'metrics',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchMetrics.pending, state => {
            state.loading = true
        })
        builder.addCase(fetchMetrics.fulfilled, (state, action) => {
            state.loading = false
            state.metrics = action.payload
            state.error = ''
        })
        builder.addCase(fetchMetrics.rejected, (state, action) => {
            state.loading = false
            state.metrics = []
            state.error = action.error.message
        })
    }
})

export default metricsSlice.reducer;