import { combineReducers, configureStore } from "@reduxjs/toolkit";
import stateAuth from "./stateAuth";


const reducers =  combineReducers({
    auth: stateAuth
})
const store = configureStore({reducer: reducers})
export type RootState =  ReturnType<typeof store.getState>

export default store;