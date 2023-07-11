import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { getRequest, addRequest } from "../../utilities/axiosHelper";

const initialState = {
    loading: false,
    products: [],
    error: '',
}


export const addProduct = (formData) => async () => {
    try {
        const jwt = Cookies.get('jwt');
        const config = {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        };
        const response = await addRequest(`api/v1/products`, formData, config);
        return response.status
    } catch (error) {
        alert(error)
    }
};

// Generated pending, fulfilled, and rejected action types
export const fetchProducts = createAsyncThunk('fetchProducts', async () => {
    try {
        const jwt = Cookies.get('jwt');
        const config = {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        };
        const response = await getRequest("api/v1/products", config)
        return response.data
    } catch (error) {
        console.log(error)
    }
})

const productSlice = createSlice({
    name: 'products',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.pending, state => {
            state.loading = true
        })
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = false
            state.products = action.payload
            state.error = ''
        })
        builder.addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false
            state.products = []
            state.error = action.error.message
        })
    }
})

// hasil define di createSlice -> reducers
// export const { increment, decrement, incrementByAmount } = productSlice.actions;

export default productSlice.reducer;