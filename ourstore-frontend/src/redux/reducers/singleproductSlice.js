import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest, deleteRequest, updateRequest } from "../../utilities/axiosHelper";
import Cookies from "js-cookie";

const initialState = {
    loading: false,
    products: [],
    error: null,
}

export const deleteSingleProduct = (id) => async () => {
    try {
        const jwt = Cookies.get('jwt');
        const config = {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        };
        const response = await deleteRequest(`api/v1/products/${id}`, config);
    } catch (error) {
        console.log(error)
        // console.log("error delete")
    }
};

export const updateSingleProduct = (id, data) => async () => {
    try {
        const jwt = Cookies.get('jwt');
        const config = {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        };
        const response = await updateRequest(`api/v1/products/${id}`, data, config);
        // console.log(response)
        return response.status
    } catch (error) {
        console.log(error)
    }
};

// Generated pending, fulfilled, and rejected action types
export const fetchSingleProduct = createAsyncThunk('fetchSingleProduct', async (id) => {
    const jwt = Cookies.get('jwt');
    const config = {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    };
    const response = await getRequest(`api/v1/products/${id}`, config)
    // console.log(response)
    return response.data
})

const singleproductSlice = createSlice({
    name: 'singleproduct',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchSingleProduct.pending, state => {
            state.loading = true
            state.error = null
        })
        builder.addCase(fetchSingleProduct.fulfilled, (state, action) => {
            state.loading = false
            state.products = action.payload
        })
        builder.addCase(fetchSingleProduct.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    }
})

// hasil define di createSlice -> reducers
// export const { increment, decrement, incrementByAmount } = productSlice.actions;

export default singleproductSlice.reducer;