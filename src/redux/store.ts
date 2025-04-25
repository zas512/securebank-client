import { configureStore, combineReducers, type Middleware } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createLogger } from "redux-logger";
import authReducer from "./authSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"]
};

const rootReducer = combineReducers({
  user: authReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middlewares: Middleware[] = [];
if (process.env.NODE_ENV === "development") {
  const logger = createLogger({ collapsed: true });
  middlewares.push(logger);
}

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(middlewares)
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
