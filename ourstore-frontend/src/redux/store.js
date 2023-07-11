import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./reducers/productSlice";
import singleProductReducer from "./reducers/singleproductSlice";
import pagesReducer from "./reducers/pagesSlice";
import singlePageReducer from "./reducers/singlePageSlice";
import themeReducer from "./reducers/themeSlice";
import metricsReducer from "./reducers/mectricsSlice"

export const store = configureStore({
        reducer: {
                products: productReducer,
                singleProduct: singleProductReducer,
                pages: pagesReducer,
                singlePage: singlePageReducer,
                theme: themeReducer,
                metrics: metricsReducer
        }
});
