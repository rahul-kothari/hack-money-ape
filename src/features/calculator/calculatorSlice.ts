import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";
import { RootState, AppThunk  } from "../../app/store";
import { calculateMock, CalculatorData, CalculatorResult } from "./calculatorAPI";

export interface CalculatorState {
    results: CalculatorResult[];
    inputs: {},
    status: 'idle' | 'loading' | 'failed';
}

const initialState: CalculatorState = {
    results: [],
    inputs: {},
    status: 'idle'
}

export const executeCalculatorAsync = createAsyncThunk(
    'calculator/calculate',
    async (userData: CalculatorData) => {
        const response = await calculateMock(userData);

        return {
            result: response,
            inputs: userData,
        };
    }
)

export const calculatorSlice = createSlice({
    name: 'calculator',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(executeCalculatorAsync.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(executeCalculatorAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.results = action.payload.result;
            state.inputs = action.payload.inputs;
        })
    }
})

export const selectResults = (state: RootState) => state.calculator.results;
export const selectInputs = (state: RootState) => state.calculator.inputs;

export default calculatorSlice.reducer;