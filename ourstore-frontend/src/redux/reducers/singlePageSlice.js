import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest, deleteRequest, updateRequest } from "../../utilities/axiosHelper";
import Cookies from "js-cookie";

const initialState = {
    loading: false,
    pages: [],
    error: '',
}

// Generated pending, fulfilled, and rejected action types
export const fetchSinglePage = createAsyncThunk('fetchSinglePage', async (id) => {
    try {
        const jwt = Cookies.get('jwt');
        const config = {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        };
        const response = await getRequest(`api/v1/pages/${id}`, config)
        return response.data
    } catch (error) {
        console.log(error)
    }
})

export const updateSinglePage = (id, data) => async () => {
    try {
        const jwt = Cookies.get('jwt');
        const config = {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        };
        const response = await updateRequest(`api/v1/pages/${id}`, data, config);
        return response.status
    } catch (error) {
        console.log(error)
        alert(error)
    }
};

const singlePageSlice = createSlice({
    name: 'singlePage',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchSinglePage.pending, state => {
            state.loading = true
        })
        builder.addCase(fetchSinglePage.fulfilled, (state, action) => {
            state.loading = false
            state.pages = action.payload
            state.error = ''
        })
        builder.addCase(fetchSinglePage.rejected, (state, action) => {
            state.loading = false
            state.pages = []
            state.error = action.error.message
        })
    }
})

// hasil define di createSlice -> reducers
// export const { increment, decrement, incrementByAmount } = productSlice.actions;

export default singlePageSlice.reducer;