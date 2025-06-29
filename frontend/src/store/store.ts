import { configureStore } from "@reduxjs/toolkit";
import { contactApi } from "./api/contactApi";
import { authApi } from "./api/authApi";
import authReducer from "./slice/authSlice";
import chatReducer from "./slice/threadSlice";
import { chatApi } from "./api/threadApi";

export const store = configureStore({
    reducer: {
        [contactApi.reducerPath]: contactApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        auth: authReducer,
        chat: chatReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(contactApi.middleware)
            .concat(authApi.middleware)
            .concat(chatApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
