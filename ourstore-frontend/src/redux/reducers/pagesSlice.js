import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest, deleteRequest, updateRequest } from "../../utilities/axiosHelper";
import Cookies from "js-cookie";

const initialState = {
    loading: false,
    pages: [],
    error: '',
}

// Generated pending, fulfilled, and rejected action types
export const fetchAllPages = createAsyncThunk('fetchAllPages', async () => {
    try {
        // const jwt = Cookies.get('jwt');
        const config = {
            headers: {
                //         Authorization: `Bearer ${jwt}`
            }
        };
        const response = await getRequest(`api/v1/pages`, config)
        return response.data
    } catch (error) {
        console.log(error)
    }
})

const pagesSlice = createSlice({
    name: 'pages',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchAllPages.pending, state => {
            state.loading = true
        })
        builder.addCase(fetchAllPages.fulfilled, (state, action) => {
            state.loading = false
            state.pages = action.payload
            state.error = ''
        })
        builder.addCase(fetchAllPages.rejected, (state, action) => {
            state.loading = false
            state.pages = []
            state.error = action.error.message
        })
    }
})

// hasil define di createSlice -> reducers
// export const { increment, decrement, incrementByAmount } = productSlice.actions;

export default pagesSlice.reducer;